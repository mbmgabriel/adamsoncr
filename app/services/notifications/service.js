const { randomUUID } = require('crypto');
const { workflow } = require('../research/workflow');
const db = require('../../models');

const roleNames = { 3: 'Research coordinator', 4: 'Department chairperson', 5: 'College dean', 6: 'CRD staff', 7: 'CRD director', 8: 'URB reviewer' };
const specs = {
  assistance: { model: 'RequestAssistanceForms', formType: 2, title: 'research_paper_title', route: 'research-presentation-assistance' },
  incentive: { model: 'IncentiveForms', formType: 3, title: 'title_of_work', route: 'research-incentive-request', reviewRoute: 'research-incentive-review' },
};
function pendingResearch(research, endorsements) {
  if (Number(research.status_id) === 2) return [];
  return endorsements.filter(e => {
    const role = Number(e.User?.UserAccount?.role_id);
    const state = workflow(research, endorsements, e.endorsement_rep_id, role);
    return state.can_endorse || state.can_assign_urb || state.can_approve_urb || state.can_complete;
  });
}
async function emit({ recipient, actorId, key, message, type, applicationType, applicationId, path, transaction }) {
  if (!recipient || Number(recipient) === Number(actorId)) return;
  // Application mutations hold the application lock; backfill holds the same lock.
  if (await db.notifications.findOne({ where: { dedupe_key: key }, transaction })) return;
  await db.notifications.create({ notification: message, user_account_id: recipient, read_status: 0,
    event_type: type, application_type: applicationType, application_id: applicationId,
    target_path: path, dedupe_key: key, created_by: actorId || null }, { transaction });
}
async function researchEvent(research, event, actor, transaction, remarks = '') {
  const endorsements = await db.Endorsements.findAll({ where: { research_id: research.id, form_type_id: 1 },
    include: [{ model: db.User, include: [{ model: db.UserAccount, attributes: ['id', 'role_id'] }] }], transaction });
  const owner = await db.User.findByPk(research.created_by, { transaction });
  const version = await db.ResearchVersions.findOne({ where: { research_id: research.id }, order: [['id', 'DESC']], transaction });
  const cycle = version?.id || 0;
  const title = research.title || 'Untitled research';
  const actorId = actor?.id;
  const path = `/review-form/${research.id}`;
  const send = (recipient, key, message, type = event) => emit({ recipient, actorId, key, message, type,
    applicationType: 'research', applicationId: research.id, path, transaction });
  const messages = {
    endorse: `${roleNames[Number(actor?.role_id)] || 'A reviewer'} endorsed “${title}”.`,
    approve_urb: `A URB reviewer approved “${title}”.`,
    request_revision: `${roleNames[Number(actor?.role_id)] || 'A reviewer'} requested revisions to “${title}”: ${remarks}`,
    assigned: `The URB reviewer assignments for “${title}” have been updated.`,
    completed: `Your research “${title}” has been completed.`,
  };
  if (messages[event]) await send(owner?.user_account_id, event === 'request_revision' ? `pending:research:${research.id}:${cycle}:revision` : `event:${randomUUID()}`, messages[event]);
  if (Number(research.status_id) === 5) {
    if (event === 'backfill') await send(owner?.user_account_id, `pending:research:${research.id}:${cycle}:revision`,
      `Revisions are required for “${title}”. Open the application to review the requested changes.`, 'action_required');
    return;
  }
  for (const e of pendingResearch(research, endorsements)) {
    const account = e.User?.UserAccount;
    const role = Number(account?.role_id);
    const action = role === 6 ? 'endorsement or URB assignment' : role === 7 ? 'final completion' : role === 8 ? 'URB review' : 'endorsement';
    await send(account?.id, `pending:research:${research.id}:${cycle}:${e.id}`,
      `“${title}” is ready for your ${action}.`, 'action_required');
  }
}
async function formEvent(type, form, event, actor, transaction, remarks = '') {
  const spec = specs[type];
  const title = form[spec.title] || 'Untitled application';
  const actorId = actor?.id;
  const path = `/${spec.route}?application_id=${form.id}`;
  if (event === 'decision') {
    const decision = Number(form.status_id) === 10 ? 'approved' : Number(form.status_id) === 11 ? 'disapproved' : 'updated';
    await emit({ recipient: form.created_by, actorId, key: `event:${randomUUID()}`,
      message: `Your ${type === 'assistance' ? 'presentation assistance request' : 'incentive application'} for “${title}” was ${decision}.${remarks ? ` Remarks: ${remarks}` : ''}`,
      type: 'decision', applicationType: type, applicationId: form.id, path, transaction });
    return;
  }
  if ([10, 11].includes(Number(form.status_id))) return;
  const rows = await db.Endorsements.findAll({ where: { research_id: form.id, form_type_id: spec.formType },
    include: [{ model: db.User, include: [{ model: db.UserAccount, attributes: ['id', 'role_id'] }] }], transaction });
  for (const e of rows) {
    if (Number(e.User?.UserAccount?.role_id) !== 7 || [10, 11].includes(Number(e.status_id))) continue;
    await emit({ recipient: e.User?.UserAccount?.id, actorId, key: `pending:${type}:${form.id}:${e.id}`,
      message: `A ${type === 'assistance' ? 'presentation assistance request' : 'incentive application'} for “${title}” is awaiting your decision.`,
      type: 'action_required', applicationType: type, applicationId: form.id,
      path: `/${spec.reviewRoute || `${spec.route}-review`}?application_id=${form.id}`, transaction });
  }
}
module.exports = { emit, researchEvent, formEvent, pendingResearch, specs };
