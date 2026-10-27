const db = require('../../models');
const { researchEvent, formEvent, specs } = require('./service');
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const respond = operation => async (req, res) => {
  try {
    const result = await db.sequelize.transaction(t => operation(req, t));
    res.status(result.status || 200).json(result.body);
  } catch (error) {
    console.error('Application operation failed:', error.name);
    res.status(error.status || 500).json({ message: error.status ? error.message : 'The application could not be saved. Please try again.' });
  }
};
const createResearch = comprehensive => respond(async (req, transaction) => {
  if (Number(req.user.role_id) !== 2) fail(403, 'Only researchers can submit research applications.');
  if (!String(req.body.title || '').trim()) fail(400, 'Research title is required.');
  const owner = await db.User.findOne({ where: { user_account_id: req.user.id }, transaction });
  if (!owner) fail(403, 'A user profile is required.');
  const reviewers = await db.User.findAll({ include: [{ model: db.UserAccount, attributes: ['role_id'], where: { active: true } }], transaction });
  const assigned = reviewers.filter(user => [6, 7].includes(Number(user.UserAccount?.role_id)) ||
    ([3, 4, 5].includes(Number(user.UserAccount?.role_id)) && Number(user.dept_id) === Number(owner.dept_id)));
  const fields = ['title', 'category', 'purpose_id', 'research_duration', 'ethical_considerations', 'submitted_by'];
  const payload = Object.fromEntries(fields.filter(key => req.body[key] !== undefined).map(key => [key, req.body[key]]));
  const include = [db.Endorsements];
  if (comprehensive) {
    payload.ResearchInvestigators = (req.body.research_investigators || []).map(({ id, research_id, created_by, ...entry }) => ({ ...entry, created_by: req.user.id }));
    payload.BudgetBreakdowns = (req.body.budget_breakdowns || []).map(({ id, research_id, created_by, ...entry }) => ({ ...entry, created_by: req.user.id }));
    include.push(db.ResearchInvestigators, db.BudgetBreakdowns);
  }
  const research = await db.Research.create({ ...payload, version_number: '1', submitted_date: new Date(),
    status_id: 1, created_by: owner.id, Endorsements: assigned.map(user => ({ form_type_id: 1,
      endorsement_rep_id: user.id, status_id: 4, created_by: req.user.id })) }, { include, transaction });
  await researchEvent(research, 'submitted', req.user, transaction);
  return { status: 201, body: { Research: research, Message: 'Research entry created.' } };
});
function includes(type) {
  return [{ model: db.Endorsements, where: { form_type_id: specs[type].formType }, required: false },
    type === 'assistance' ? { model: db.CAssistanceFormProofs, include: [db.SAssistanceFormProofs] } : { model: db.CAttachmentInfos }];
}
const createForm = type => respond(async (req, transaction) => {
  const spec = specs[type];
  const Model = db[spec.model];
  const excluded = new Set(['id', 'created_by', 'created_at', 'updated_by', 'updated_at', 'deleted_by', 'deleted_at', 'status_id', 'approved_amount']);
  const payload = Object.fromEntries(Object.keys(Model.rawAttributes).filter(key => !excluded.has(key) && req.body[key] !== undefined).map(key => [key, req.body[key]]));
  const reviewers = await db.User.findAll({ include: [{ model: db.UserAccount, where: { role_id: 7, active: true } }], transaction });
  const child = type === 'assistance' ? 'CAssistanceFormProofs' : 'CAttachmentInfos';
  // Copy only declared child attributes; parent IDs and audit fields are server-owned.
  const childModel = db[child];
  const childFields = Object.keys(childModel.rawAttributes).filter(key => !excluded.has(key) && !['request_assistance_form_id', 'incentive_form_id'].includes(key));
  payload[child] = (req.body[child] || []).map(entry => Object.fromEntries(childFields.filter(key => entry[key] !== undefined).map(key => [key, entry[key]])));
  const form = await Model.create({ ...payload, created_by: req.user.id, status_id: 1,
    Endorsements: reviewers.map(user => ({ form_type_id: spec.formType, endorsement_rep_id: user.id, status_id: 4, created_by: req.user.id })) },
    { include: [childModel, db.Endorsements], transaction });
  await formEvent(type, form, 'submitted', req.user, transaction);
  return { status: 201, body: { [spec.model]: form, Message: 'Application submitted.' } };
});
const listForms = (type, own = false) => respond(async (req, transaction) => {
  const spec = specs[type];
  let where = { created_by: req.user.id };
  if (!own) {
    if (Number(req.user.role_id) !== 7) fail(403, 'Only assigned CRD directors may view this review queue.');
    const profile = await db.User.findOne({ where: { user_account_id: req.user.id }, transaction });
    const assignments = profile ? await db.Endorsements.findAll({ where: { form_type_id: spec.formType, endorsement_rep_id: profile.id }, transaction }) : [];
    where = { id: assignments.map(e => e.research_id) };
  }
  const rows = await db[spec.model].findAll({ where, include: includes(type), order: [['created_at', 'DESC'], ['id', 'DESC']], transaction });
  return { body: { [spec.model]: rows } };
});
async function canView(type, form, account, transaction) {
  if (Number(form.created_by) === Number(account.id) || Number(account.role_id) === 1) return true;
  if (Number(account.role_id) !== 7) return false;
  const profile = await db.User.findOne({ where: { user_account_id: account.id }, transaction });
  return Boolean(profile && await db.Endorsements.findOne({ where: { research_id: form.id, form_type_id: specs[type].formType, endorsement_rep_id: profile.id }, transaction }));
}
const getForm = type => respond(async (req, transaction) => {
  const spec = specs[type];
  const form = await db[spec.model].findByPk(req.params.id, { include: includes(type), transaction });
  if (!form || !await canView(type, form, req.user, transaction)) fail(404, 'Application is unavailable.');
  return { body: { [spec.model]: [form] } };
});
const reviewForm = respond(async (req, transaction) => {
  let formType = Number(req.params.form_type_id);
  let formId = req.params.research_id;
  let existing;
  if (!formId) {
    existing = await db.Endorsements.findByPk(req.params.id, { transaction });
    if (!existing) fail(404, 'Review assignment not found.');
    formType = Number(existing.form_type_id);
    formId = existing.research_id;
  }
  const type = formType === 2 ? 'assistance' : formType === 3 ? 'incentive' : null;
  if (!type) fail(403, 'Use the research workflow to review research.');
  if (Number(req.user.role_id) !== 7) fail(403, 'Only the assigned CRD director may decide this application.');
  const form = await db[specs[type].model].findByPk(formId, { transaction, lock: transaction.LOCK.UPDATE });
  if (!form) fail(404, 'Application is unavailable.');
  const profile = await db.User.findOne({ where: { user_account_id: req.user.id }, transaction });
  const assignment = profile && await db.Endorsements.findOne({ where: { research_id: form.id, form_type_id: formType, endorsement_rep_id: profile.id }, transaction });
  if (!assignment || (existing && Number(existing.id) !== Number(assignment.id))) fail(403, 'This application is not assigned to you.');
  const status = req.body.status_id === undefined ? Number(assignment.status_id) : Number(req.body.status_id);
  const remarks = req.body.remarks === undefined ? (assignment.remarks || '') : String(req.body.remarks).trim();
  if (![10, 11].includes(status)) fail(400, 'Choose approve or disapprove.');
  if ([10, 11].includes(Number(form.status_id)) && Number(form.status_id) !== status) fail(409, 'This application already has a final decision.');
  let approvedAmount;
  if (status === 10) {
    const value = req.body.approved_amount;
    if (!['string', 'number'].includes(typeof value) || !/^\d+(\.\d{1,2})?$/.test(String(value)) ||
        !Number.isFinite(Number(value)) || Number(value) <= 0 || Number(value) > 9999999999.99) {
      fail(400, 'An approved amount greater than zero with up to two decimal places is required.');
    }
    approvedAmount = Number(value).toFixed(2);
    if (Number(form.status_id) === 10 && form.approved_amount != null && Number(form.approved_amount) !== Number(approvedAmount)) {
      fail(409, 'The approved amount cannot be changed after approval.');
    }
  }
  const changed = (status === 10 && Number(form.approved_amount) !== Number(approvedAmount)) || Number(assignment.status_id) !== status || String(assignment.remarks || '') !== remarks;
  if (changed) {
    await assignment.update({ status_id: status, remarks, updated_by: req.user.id }, { transaction });
    await form.update({ status_id: status, ...(status === 10 ? { approved_amount: approvedAmount } : {}), updated_by: req.user.id }, { transaction });
    await formEvent(type, form, 'decision', req.user, transaction, remarks);
  }
  return { body: { Endorsements: assignment, Message: 'Application decision saved.' } };
});
async function researchAccess(req, res, next) {
  try {
    const research = await db.Research.findByPk(req.params.id || req.params.research_id);
    const actor = await db.User.findOne({ where: { user_account_id: req.user.id } });
    const assigned = research && actor && await db.Endorsements.findOne({ where: { research_id: research.id, form_type_id: 1, endorsement_rep_id: actor.id } });
    if (!research || (Number(req.user.role_id) !== 1 && (!actor || (Number(research.created_by) !== Number(actor.id) && !assigned)))) {
      return res.status(404).json({ message: 'Application is unavailable.' });
    }
    return next();
  } catch { return res.status(500).json({ message: 'Application is unavailable. Please try again.' }); }
}
module.exports = { researchAccess, createResearch, createForm, listForms, getForm, reviewForm, canView };
