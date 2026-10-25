// Explicitly local-only: npm run test:notifications:local
require('dotenv').config();
const assert = require('node:assert/strict');
const db = require('../app/models');
const TokenService = require('../app/services/token/token_service');
const { researchEvent, formEvent } = require('../app/services/notifications/service');
let server;
const accounts = [], profiles = [], applications = [], extras = [];
let department;
let checks = 0;
async function main() {
  if (process.env.DB_DATABASE !== 'adamsoncr_local' || !['localhost', '127.0.0.1'].includes(process.env.DB_HOST)) throw new Error('Local database required.');
  db.sequelize.options.logging = false;
  const app = require('../app');
  server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  const base = `http://127.0.0.1:${server.address().port}/api/v1`;
  async function request(account, path, method = 'GET', body, expected = 200) {
    const response = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json',
      ...(account ? { Authorization: `Bearer ${TokenService.generateToken(account.id)}` } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const data = await response.json();
    assert.equal(response.status, expected, `${method} ${path}: ${JSON.stringify(data)}`);
    checks++;
    return data;
  }
  department = await db.Departments.create({ dept_name: `Notification tests ${Date.now()}` });
  // An account without a profile ensures profile IDs cannot be assumed to equal account IDs.
  accounts.push(await db.UserAccount.create({ username: `notification-gap-${Date.now()}`, role_id: 2 }));
  const users = {};
  for (const [name, role] of [['owner', 2], ['coordinator', 3], ['chair', 4], ['dean', 5], ['staff', 6], ['director', 7], ['urb1', 8], ['urb2', 8], ['stranger', 2]]) {
    const account = await db.UserAccount.create({ username: `notification-${name}-${Date.now()}`, role_id: role });
    accounts.push(account);
    const profile = await db.User.create({ user_account_id: account.id, dept_id: department.id, first_name: 'Notification', last_name: name });
    profiles.push(profile);
    users[name] = { account, profile };
  }
  const { owner, coordinator, chair, dean, staff, director, urb1, urb2, stranger } = users;
  assert.notEqual(director.account.id, director.profile.id);
  const list = (user, query = '') => request(user.account, `/notifications${query}`);
  const count = (user, type, id) => db.notifications.count({ where: { user_account_id: user.account.id, application_type: type, application_id: id } });
  await request(null, '/notifications', 'GET', undefined, 401);
  await request(owner.account, '/notifications?cursor=broken', 'GET', undefined, 400);
  await request(owner.account, '/notifications?limit=999', 'GET', undefined, 400);
  const body = { title: 'Notification integration proposal', category: '1', purpose_id: 1, research_investigators: [], budget_breakdowns: [] };
  const research = (await request(owner.account, '/research/full/create', 'POST', body, 201)).Research;
  applications.push(['research', research.id]);
  const path = `/research/${research.id}`;
  assert.equal(await count(coordinator, 'research', research.id), 1);
  for (const user of [owner, chair, dean, staff, director, urb1, stranger]) assert.equal(await count(user, 'research', research.id), 0);
  await request(stranger.account, `/research/${research.id}`, 'GET', undefined, 404);
  await request(stranger.account, `/endorsements/research/${research.id}`, 'GET', undefined, 404);
  const comments = await request(owner.account, `/endorsements/research/${research.id}`);
  assert.ok(comments.Endorsements.every(row => Number(row.form_type_id) === 1));
  // Failed notification insertion must roll back the actual endorsement.
  const createNotification = db.notifications.create;
  db.notifications.create = async () => { throw new Error('Injected notification failure'); };
  try { await request(coordinator.account, `${path}/review`, 'PUT', { action: 'endorse' }, 500); }
  finally { db.notifications.create = createNotification; }
  assert.equal((await db.Endorsements.findOne({ where: { research_id: research.id, form_type_id: 1, endorsement_rep_id: coordinator.profile.id } })).status_id, 4);
  await request(coordinator.account, `${path}/review`, 'PUT', { action: 'request_revision', remarks: 'Clarify methods.' });
  assert.equal(await count(owner, 'research', research.id), 1);
  const backfillResearch = () => db.sequelize.transaction(async transaction => {
    const row = await db.Research.findByPk(research.id, { transaction, lock: transaction.LOCK.UPDATE });
    await researchEvent(row, 'backfill', null, transaction);
  });
  await backfillResearch(); await backfillResearch();
  assert.equal(await count(owner, 'research', research.id), 1);
  await request(owner.account, `${path}/resubmit`, 'PUT', body);
  assert.equal(await count(coordinator, 'research', research.id), 2);
  await request(coordinator.account, `${path}/review`, 'PUT', { action: 'endorse' });
  assert.equal(await count(chair, 'research', research.id), 1);
  await request(chair.account, `${path}/review`, 'PUT', { action: 'endorse' });
  assert.equal(await count(dean, 'research', research.id), 1);
  await request(dean.account, `${path}/review`, 'PUT', { action: 'endorse' });
  assert.equal(await count(staff, 'research', research.id), 1);
  const ids = [urb1.profile.id, urb2.profile.id];
  await request(staff.account, `${path}/urb-members`, 'PUT', { member_ids: ids });
  for (const user of [urb1, urb2]) assert.equal(await count(user, 'research', research.id), 1);
  const beforeAssignmentRepeat = await count(owner, 'research', research.id);
  await request(staff.account, `${path}/urb-members`, 'PUT', { member_ids: ids });
  assert.equal(await count(owner, 'research', research.id), beforeAssignmentRepeat);
  await request(urb1.account, `${path}/review`, 'PUT', { action: 'approve_urb' });
  assert.equal(await count(director, 'research', research.id), 0);
  await request(urb2.account, `${path}/review`, 'PUT', { action: 'request_revision', remarks: 'Minor spelling edits.' });
  const previousUrb = await count(urb1, 'research', research.id);
  await request(owner.account, `${path}/resubmit`, 'PUT', body);
  assert.equal(await count(urb1, 'research', research.id), previousUrb + 1);
  for (const user of [urb1, urb2]) await request(user.account, `${path}/review`, 'PUT', { action: 'approve_urb' });
  assert.equal(await count(director, 'research', research.id), 1);
  await request(director.account, `${path}/complete`, 'PUT', {});
  assert.ok((await list(owner)).notifications.some(row => row.event_type === 'completed'));
  await backfillResearch();

  for (const [type, route, titleField] of [['assistance', 'request-assistance-forms', 'research_paper_title'], ['incentive', 'incentive-forms', 'title_of_work']]) {
    const model = type === 'assistance' ? db.RequestAssistanceForms : db.IncentiveForms;
    const key = type === 'assistance' ? 'RequestAssistanceForms' : 'IncentiveForms';
    const form = (await request(owner.account, `/${route}/create`, 'POST', { [titleField]: 'Notification integration request' }, 201))[key];
    applications.push([type, form.id]);
    assert.equal(await count(director, type, form.id), 1);
    assert.equal(await count(owner, type, form.id), 0);
    assert.ok((await request(director.account, `/${route}/all`))[key].some(row => row.id === form.id));
    await request(stranger.account, `/${route}/${form.id}`, 'GET', undefined, 404);
    await request(stranger.account, `/${route}/all`, 'GET', undefined, 403);
    const formType = type === 'assistance' ? 2 : 3;
    await request(stranger.account, `/endorsements/status/${form.id}/${formType}`, 'PUT', { status_id: 10 }, 403);
    await request(director.account, `/endorsements/status/${form.id}/${formType}`, 'PUT', { status_id: 10, remarks: 'Approved for support.' });
    assert.equal(await count(owner, type, form.id), 1);
    await request(director.account, `/endorsements/status/${form.id}/${formType}`, 'PUT', { status_id: 10, remarks: 'Approved for support.' });
    assert.equal(await count(owner, type, form.id), 1);
    await request(director.account, `/endorsements/status/${form.id}/${formType}`, 'PUT', { status_id: 10, remarks: 'Updated remarks.' });
    assert.equal(await count(owner, type, form.id), 2);
    await request(director.account, `/endorsements/status/${form.id}/${formType}`, 'PUT', { status_id: 11 }, 409);
    await db.sequelize.transaction(async transaction => {
      const row = await model.findByPk(form.id, { transaction, lock: transaction.LOCK.UPDATE });
      await formEvent(type, row, 'backfill', null, transaction);
    });
    assert.equal(await count(director, type, form.id), 1);
  }
  // Stable pagination for identical timestamps, account isolation, idempotent read controls.
  const sameTime = new Date('2026-10-25T12:00:00Z');
  for (let index = 0; index < 3; index++) {
    const row = await db.notifications.create({ user_account_id: stranger.account.id, notification: `Pagination ${index}`, read_status: 0,
      dedupe_key: `test:${Date.now()}:${index}`, created_at: sameTime });
    extras.push(row.id);
  }
  const first = await list(stranger, '?limit=2');
  const second = await list(stranger, `?limit=2&cursor=${first.next_cursor}`);
  assert.deepEqual([...first.notifications, ...second.notifications].map(row => row.id), [...extras].reverse());
  assert.equal(first.unread_count, 3);
  await request(owner.account, `/notifications/${extras[0]}/read`, 'PATCH', {}, 404);
  for (let index = 0; index < 2; index++) await request(stranger.account, `/notifications/${extras[0]}/read`, 'PATCH', {});
  assert.equal((await list(stranger, '?unread=true')).unread_count, 2);
  await request(stranger.account, '/notifications/read-all', 'PATCH', {});
  assert.equal((await list(stranger, '?unread=true')).notifications.length, 0);
  assert.ok((await list(owner)).unread_count > 0);
  console.log(`Notification integration passed (${checks} HTTP checks plus recipient, rollback, backfill and pagination assertions).`);
}
async function cleanup() {
  for (const [type, id] of applications.reverse()) {
    await db.notifications.destroy({ where: { application_type: type, application_id: id }, force: true });
    const formType = type === 'research' ? 1 : type === 'assistance' ? 2 : 3;
    await db.Endorsements.destroy({ where: { research_id: id, form_type_id: formType }, force: true });
    if (type === 'research') {
      for (const model of [db.ResearchVersions, db.ResearchInvestigators, db.BudgetBreakdowns, db.ResearchDocuments]) await model.destroy({ where: { research_id: id }, force: true });
      await db.Research.destroy({ where: { id }, force: true });
    } else await (type === 'assistance' ? db.RequestAssistanceForms : db.IncentiveForms).destroy({ where: { id }, force: true });
  }
  if (extras.length) await db.notifications.destroy({ where: { id: extras }, force: true });
  if (profiles.length) await db.User.destroy({ where: { id: profiles.map(row => row.id) }, force: true });
  if (accounts.length) await db.UserAccount.destroy({ where: { id: accounts.map(row => row.id) }, force: true, hooks: false });
  if (department) await db.Departments.destroy({ where: { id: department.id }, force: true });
  if (server) await new Promise(resolve => server.close(resolve));
  await db.sequelize.close();
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(cleanup);
