// Run explicitly against the local app: node tests/research-workflow.integration.js
require('dotenv').config();
const assert = require('node:assert/strict');
const db = require('../app/models');
const base = process.env.TEST_API_BASE || 'http://localhost:3000/api/v1';
let researchId;
let checks = 0;
async function request(token, path, method = 'GET', body, expected = 200) {
  const response = await fetch(base + path, { method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await response.json();
  assert.equal(response.status, expected, `${method} ${path}: ${JSON.stringify(data)}`);
  checks++;
  return data;
}
async function main() {
  if (process.env.DB_DATABASE !== 'adamsoncr_local' || !['127.0.0.1', 'localhost'].includes(process.env.DB_HOST)) throw new Error('Local test database required.');
  db.sequelize.options.logging = false;
  const tokens = {};
  for (const user of ['local_researcher', 'local_rc', 'local_chair', 'local_dean', 'local_crd_staff', 'local_crd_director', 'local_urb_1', 'local_urb_2', 'local_urb_3']) {
    tokens[user] = (await request(null, '/user/login', 'POST', { username: user, password: 'password' })).token;
  }
  const owner = tokens.local_researcher, director = tokens.local_crd_director, staff = tokens.local_crd_staff;
  const body = { title: 'LOCAL TEST - Temporary full workflow verification', category: '1', purpose_id: 1,
    version_number: '999', research_investigators: [], budget_breakdowns: [] };
  const created = await request(owner, '/research/full/create', 'POST', body, 201);
  researchId = created.Research.id;
  const retainedDocument = await db.ResearchDocuments.create({ research_id: researchId,
    document_title_id: 1, document_filepath: '/local-test-retained-document.pdf' });
  assert.equal(created.Research.version_number, '1');
  const path = `/research/${researchId}`;
  await request(tokens.local_chair, `${path}/review`, 'PUT', { action: 'endorse' }, 409);
  await request(director, `${path}/complete`, 'PUT', {}, 409);
  await request(tokens.local_rc, `${path}/review`, 'PUT', { action: 'request_revision' }, 400);
  await request(tokens.local_rc, `${path}/review`, 'PUT', { action: 'request_revision', remarks: 'Clarify the research methods.' });
  const returned = await request(owner, `${path}/workflow`);
  assert.equal(returned.research.status_id, 5);
  assert.equal(returned.workflow.can_resubmit, true);
  await request(tokens.local_chair, `${path}/resubmit`, 'PUT', body, 409);
  const revised = await request(owner, `${path}/resubmit`, 'PUT', { ...body, title: body.title + ' v2' });
  assert.equal(revised.Research.version_number, '2');
  assert.equal(revised.Research.status_id, 1);
  assert.equal(revised.Research.purpose_id, 2);
  const documentAfterRevision = await db.ResearchDocuments.findByPk(retainedDocument.id);
  assert.equal(documentAfterRevision.document_filepath, '/local-test-retained-document.pdf');
  assert.equal(await db.ResearchDocuments.count({ where: { research_id: researchId } }), 1);
  const history = (await request(owner, `${path}/workflow`)).review_history;
  assert.equal(history.length, 1);
  assert.equal(history[0].version_number, '1');
  assert.equal(history[0].remarks, 'Clarify the research methods.');
  assert.ok(Number.isFinite(Date.parse(history[0].reviewed_at)));
  const currentRemarks = await request(owner, `/endorsements/research/${researchId}`);
  assert.ok(currentRemarks.Endorsements.every(entry => Number.isFinite(Date.parse(entry.updated_at))));
  assert.equal(await db.ResearchVersions.count({ where: { research_id: researchId } }), 1);
  await request(tokens.local_crd_staff, `${path}/review`, 'PUT', { action: 'request_revision', remarks: 'Not permitted' }, 409);
  for (const user of ['local_rc', 'local_chair', 'local_dean']) {
    await request(tokens[user], `/endorsements/status/${researchId}/1`, 'PUT', { status_id: 6 });
  }
  await request(director, `/research/status/${researchId}/2`, 'PUT', {}, 409);
  await request(director, '/research/urb-members', 'GET', undefined, 403);
  const members = (await request(staff, '/research/urb-members')).members;
  const users = await db.UserAccount.findAll({ where: { username: ['local_urb_1', 'local_urb_2', 'local_urb_3'] }, include: [db.User] });
  const ids = [1, 2, 3].map(index => users.find(user => user.username === `local_urb_${index}`).User.id);
  assert.ok(ids.every(id => members.some(member => member.id === id)));
  assert.equal((await request(staff, `${path}/workflow`)).workflow.can_assign_urb, true);
  await request(staff, `${path}/urb-members`, 'PUT', { member_ids: [ids[0]] }, 400);
  await request(staff, `${path}/urb-members`, 'PUT', { member_ids: [ids[0], ids[0]] }, 400);
  await request(director, `${path}/urb-members`, 'PUT', { member_ids: ids.slice(0, 2) }, 409);
  await request(staff, `${path}/urb-members`, 'PUT', { member_ids: ids.slice(0, 2) });
  const staffState = (await request(staff, `${path}/workflow`)).workflow;
  assert.equal(staffState.can_assign_urb, true);
  assert.equal(staffState.can_endorse, false);
  assert.equal((await request(director, `${path}/workflow`)).workflow.can_assign_urb, false);
  const pendingDirector = await db.Endorsements.findOne({ where: { research_id: researchId, endorsement_rep_id: 7, form_type_id: 1 } });
  assert.equal(pendingDirector.status_id, 4);
  await request(tokens.local_urb_3, `${path}/workflow`, 'GET', undefined, 403);
  const unassignedList = await request(tokens.local_urb_3, '/research/all');
  assert.ok(!unassignedList.some(research => research.id === researchId));
  const assignedList = await request(tokens.local_urb_1, '/research/all');
  assert.ok(assignedList.some(research => research.id === researchId));
  await request(tokens.local_urb_1, `${path}/review`, 'PUT', { action: 'approve_urb' });
  await request(director, `${path}/complete`, 'PUT', {}, 409);
  await request(staff, `${path}/urb-members`, 'PUT', { member_ids: ids.slice(1) }, 409);
  await request(staff, `${path}/urb-members`, 'PUT', { member_ids: ids });
  const expanded = await request(director, `${path}/workflow`);
  assert.equal(expanded.workflow.assigned_urb.length, 3);
  assert.equal(expanded.workflow.approved_urb_count, 1);
  await request(tokens.local_urb_2, `${path}/review`, 'PUT', { action: 'approve_urb' });
  await request(director, `${path}/complete`, 'PUT', {}, 409);
  // A pending URB member returns minor edits directly to the owner, keeping this version.
  await request(tokens.local_urb_3, `${path}/review`, 'PUT', { action: 'request_revision' }, 400);
  await request(tokens.local_urb_3, `${path}/review`, 'PUT', { action: 'request_revision', remarks: 'Correct the abstract spelling.' });
  const minor = await request(owner, `${path}/workflow`);
  assert.equal(minor.workflow.revision_type, 'urb_minor');
  assert.equal(minor.workflow.revision_remarks, 'Correct the abstract spelling.');
  assert.equal(minor.workflow.can_resubmit, true);
  assert.equal(minor.research.version_number, '2');
  await request(director, `${path}/complete`, 'PUT', {}, 409);
  await request(staff, `${path}/urb-members`, 'PUT', { member_ids: ids }, 409);
  await request(tokens.local_urb_3, `${path}/review`, 'PUT', { action: 'approve_urb' }, 409);
  await request(tokens.local_urb_3, `${path}/resubmit`, 'PUT', body, 409);
  const minorResubmitted = await request(owner, `${path}/resubmit`, 'PUT', { ...body, title: 'Corrected abstract', version_number: '999' });
  assert.equal(minorResubmitted.Research.version_number, '2');
  assert.equal(minorResubmitted.Research.status_id, 3);
  assert.equal(minorResubmitted.workflow.stage, 'urb_review');
  assert.deepEqual(minorResubmitted.workflow.assigned_urb.map(member => member.user_id), ids);
  assert.ok(minorResubmitted.workflow.assigned_urb.every(member => member.status_id === 4));
  assert.equal(await db.ResearchDocuments.count({ where: { research_id: researchId } }), 1);
  const afterMinor = await request(owner, `${path}/workflow`);
  assert.ok(afterMinor.review_history.some(entry => entry.remarks === 'Correct the abstract spelling.' && entry.version_number === '2'));
  assert.ok(afterMinor.review_history.some(entry => entry.remarks === 'Clarify the research methods.' && entry.version_number === '1'));
  const unchangedDepartmental = await db.Endorsements.findAll({ where: { research_id: researchId, form_type_id: 1 },
    include: [{ model: db.User, include: [{ model: db.UserAccount, attributes: ['role_id'] }] }] });
  assert.ok(unchangedDepartmental.filter(entry => [3, 4, 5, 6].includes(entry.User.UserAccount.role_id)).every(entry => entry.status_id === 6));
  await request(director, `${path}/complete`, 'PUT', {}, 409);
  await request(tokens.local_urb_1, `${path}/review`, 'PUT', { action: 'approve_urb' });
  await request(tokens.local_urb_2, `${path}/review`, 'PUT', { action: 'approve_urb' });
  await request(tokens.local_urb_3, `${path}/review`, 'PUT', { action: 'approve_urb' });
  await request(tokens.local_urb_1, `${path}/complete`, 'PUT', {}, 409);
  const ready = await request(director, `${path}/workflow`);
  assert.equal(ready.workflow.can_complete, true);
  await request(staff, `${path}/complete`, 'PUT', {}, 409);
  await request(director, `${path}/complete`, 'PUT', {});
  const complete = await request(owner, `${path}/workflow`);
  assert.equal(complete.research.status_id, 2);
  await pendingDirector.reload();
  assert.equal(pendingDirector.status_id, 2);
  assert.equal(complete.workflow.stage, 'completed');
  const monitored = await db.MonitoringProject.findOne({ where: { research_id: researchId } });
  assert.ok(monitored, 'Director completion enrolls the research in monitoring');
  assert.equal(await db.MonitoringItem.count({ where: { project_id: monitored.id } }), 25);
  await request(owner, `/monitoring/${monitored.id}`);
  await request(staff, `/monitoring/${monitored.id}`);
  await request(director, `/monitoring/${monitored.id}`);
  await request(staff, `${path}/urb-members`, 'PUT', { member_ids: ids }, 409);
  await request(owner, `${path}/resubmit`, 'PUT', body, 409);
  console.log(`Passed ${checks} local API checks: revision/versioning, ordered endorsements, flexible URB assignment, visibility, all-member approval, and director completion.`);
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; }).finally(async () => {
  if (researchId) {
    const monitored = await db.MonitoringProject.findOne({ where: { research_id: researchId } });
    if (monitored) {
      await db.MonitoringClearance.destroy({ where: { project_id: monitored.id }, force: true });
      await db.MonitoringEvent.destroy({ where: { project_id: monitored.id }, force: true });
      await db.MonitoringItem.destroy({ where: { project_id: monitored.id }, force: true });
      await monitored.destroy({ force: true });
    }
    await db.notifications.destroy({ where: { application_type: 'research', application_id: researchId }, force: true });
    for (const model of [db.Endorsements, db.ResearchVersions, db.ResearchInvestigators, db.BudgetBreakdowns, db.ResearchDocuments]) {
      await model.destroy({ where: { research_id: researchId } });
    }
    await db.Research.destroy({ where: { id: researchId } });
  }
  await db.sequelize.close();
});
