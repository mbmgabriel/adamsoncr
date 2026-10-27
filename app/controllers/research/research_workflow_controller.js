const db = require('../../models');
const { researchEvent } = require('../../services/notifications/service');
const { workflow } = require('../../services/research/workflow');
const fail = (status, message) => { const error = new Error(message); error.status = status; throw error; };

async function context(req, transaction) {
  const actor = await db.User.findOne({ where: { user_account_id: req.user.id }, transaction });
  if (!actor) fail(403, 'A user profile is required.');
  const research = await db.Research.findByPk(req.params.id || req.params.research_id, {
    transaction, lock: transaction.LOCK.UPDATE,
  });
  if (!research) fail(404, 'Research not found.');
  const endorsements = await db.Endorsements.findAll({
    where: { research_id: research.id, form_type_id: 1 },
    include: [{ model: db.User, include: [{ model: db.UserAccount, attributes: ['id', 'role_id'] }] }],
    transaction,
  });
  const role = Number(req.user.role_id);
  if (role !== 1 && research.created_by !== actor.id && !endorsements.some(e => e.endorsement_rep_id === actor.id)) {
    fail(403, 'This research is not assigned to you.');
  }
  return { actor, research, endorsements, role, state: workflow(research, endorsements, actor.id, role) };
}

const run = (operation) => async (req, res) => {
  try {
    const result = await db.sequelize.transaction(async transaction => operation(req, transaction));
    res.status(200).json(result);
  } catch (error) { res.status(error.status || 500).json({ message: error.message }); }
};

const ResearchWorkflowController = {
  members: async (req, res) => {
    if (Number(req.user.role_id) !== 6) return res.status(403).json({ message: 'Only CRD staff can assign URB members.' });
    try {
      const members = await db.User.findAll({
        attributes: ['id', 'first_name', 'middle_name', 'last_name', 'dept_id'],
        include: [{ model: db.UserAccount, attributes: ['id', 'role_id', 'email'], where: { role_id: 8, active: true } },
          { model: db.Departments, attributes: ['dept_name'] }],
        order: [['last_name', 'ASC'], ['id', 'ASC']],
      });
      res.json({ members });
    } catch (error) { res.status(500).json({ message: error.message }); }
  },
  get: run(async (req, transaction) => {
    const { research, state } = await context(req, transaction);
    const details = await db.Research.findByPk(research.id, {
      include: [db.ResearchInvestigators, db.BudgetBreakdowns, db.ResearchDocuments], transaction,
    });
    const versions = await db.ResearchVersions.findAll({
      where: { research_id: research.id }, order: [['id', 'DESC']], transaction,
    });
    const roleNames = { 3: 'College Research Coordinator', 4: 'Department Chairperson',
      5: 'College Dean', 6: 'CRD Staff', 7: 'CRD Director', 8: 'URB Member' };
    const review_history = versions.flatMap(version => {
      const snapshot = JSON.parse(version.snapshot);
      return (snapshot.endorsements || []).filter(entry => String(entry.remarks || '').trim() &&
        (snapshot.revision_type !== 'urb_minor' || Number(entry.User?.UserAccount?.role_id) === 8)).map(entry => ({
        id: `history-${version.id}-${entry.id}`, endorsement_rep_id: entry.endorsement_rep_id,
        version_number: version.version_number, remarks: entry.remarks,
        reviewed_at: entry.updated_at || entry.created_at, status_id: entry.status_id,
        role_name: roleNames[entry.User?.UserAccount?.role_id] || 'Reviewer',
        User: { first_name: entry.User?.first_name, middle_name: entry.User?.middle_name,
          last_name: entry.User?.last_name },
      }));
    });
    return { workflow: state, research: details, review_history };
  }),
  review: run(async (req, transaction) => {
    const { actor, research, endorsements, state, role } = await context(req, transaction);
    const action = req.body.action || (Number(req.body.status_id) === 5 ? 'request_revision' :
      Number(req.body.status_id) === 6 ? (role === 8 ? 'approve_urb' : 'endorse') : '');
    if (!['endorse', 'request_revision', 'approve_urb'].includes(action)) fail(400, 'Choose a valid research review action.');
    const allowed = action === 'request_revision' ? state.can_request_revision :
      action === 'approve_urb' ? state.can_approve_urb : state.can_endorse;
    if (!allowed) fail(409, 'This action is not available at the current review stage.');
    const remarks = String(req.body.remarks || '').trim();
    if (action === 'request_revision' && !remarks) fail(400, 'Explain the revisions required.');
    const own = endorsements.find(e => e.endorsement_rep_id === actor.id);
    await own.update({ status_id: action === 'request_revision' ? 5 : 6,
      remarks, updated_by: req.user.id }, { transaction });
    if (action === 'request_revision') await research.update({ status_id: 5 }, { transaction });
    await researchEvent(research, action, req.user, transaction, remarks);
    return { message: action === 'request_revision' ? 'Returned to the researcher for revision.' :
      action === 'approve_urb' ? 'URB approval recorded.' : 'Research endorsed.',
      workflow: workflow(research, endorsements, actor.id, role) };
  }),
  assign: run(async (req, transaction) => {
    const { actor, research, endorsements, state } = await context(req, transaction);
    if (!state.can_assign_urb) fail(409, 'Only assigned CRD staff can assign URB members after the coordinator, chairperson, and dean endorsements.');
    const ids = req.body.member_ids;
    if (!Array.isArray(ids) || ids.length < 2 || !ids.every(id => Number.isInteger(id) && id > 0) || new Set(ids).size !== ids.length) {
      fail(400, 'Select at least two distinct URB members.');
    }
    const members = await db.User.findAll({ where: { id: ids },
      include: [{ model: db.UserAccount, where: { role_id: 8, active: true }, attributes: ['role_id'] }], transaction });
    if (members.length !== ids.length) fail(400, 'Every selected reviewer must be an active URB member.');
    const existing = endorsements.filter(e => Number(e.User?.UserAccount?.role_id) === 8);
    if (existing.some(e => e.status_id === 6 && !ids.includes(e.endorsement_rep_id))) {
      fail(409, 'A URB member who has approved cannot be removed.');
    }
    for (const entry of existing) {
      if (!ids.includes(entry.endorsement_rep_id)) await entry.destroy({ transaction });
    }
    for (const id of ids) {
      if (!existing.some(e => e.endorsement_rep_id === id)) await db.Endorsements.create({
        research_id: research.id, form_type_id: 1, endorsement_rep_id: id, status_id: 4, created_by: req.user.id,
      }, { transaction });
    }
    const assignmentsChanged = existing.length !== ids.length || ids.some(id => !existing.some(e => e.endorsement_rep_id === id));
    const staff = endorsements.find(entry => entry.endorsement_rep_id === actor.id);
    const staffChanged = Number(staff.status_id) !== 6;
    if (staffChanged) await staff.update({ status_id: 6, updated_by: req.user.id }, { transaction });
    await research.update({ status_id: 3 }, { transaction });
    if (assignmentsChanged || staffChanged) await researchEvent(research, assignmentsChanged ? 'assigned' : 'endorse', req.user, transaction);
    return { message: 'URB reviewers assigned. Awaiting all assigned members’ approvals.' };
  }),
  complete: run(async (req, transaction) => {
    const { actor, research, endorsements, state } = await context(req, transaction);
    if (!state.can_complete) fail(409, 'Completion requires director access and approval from every assigned URB member.');
    const director = endorsements.find(entry => entry.endorsement_rep_id === actor.id);
    await director.update({ status_id: 2, updated_by: req.user.id }, { transaction });
    await research.update({ status_id: 2, updated_by: req.user.id }, { transaction });
    await researchEvent(research, 'completed', req.user, transaction);
    return { message: 'Research completed.', Research: research };
  }),
  resubmit: run(async (req, transaction) => {
    const { actor, research, endorsements, state } = await context(req, transaction);
    if (!state.can_resubmit) fail(409, 'Only the researcher can resubmit an application returned for revision.');
    if (!String(req.body.title || '').trim()) fail(400, 'Research title is required.');
    if (!Array.isArray(req.body.research_investigators) || !Array.isArray(req.body.budget_breakdowns)) {
      fail(400, 'Investigators and budget breakdowns must be arrays.');
    }
    const details = await db.Research.findByPk(research.id, {
      include: [db.ResearchInvestigators, db.BudgetBreakdowns, db.ResearchDocuments], transaction,
    });
    await db.ResearchVersions.create({ research_id: research.id,
      version_number: research.version_number || '1',
      snapshot: JSON.stringify({ research: details, endorsements, revision_type: state.revision_type }), created_by: req.user.id,
    }, { transaction });
    const previous = Number(String(research.version_number || '1').replace(/^v/i, '')) || 1;
    const fields = {};
    for (const key of ['title', 'category', 'purpose_id', 'research_duration', 'ethical_considerations']) {
      if (req.body[key] !== undefined) fields[key] = req.body[key];
    }
    await research.update({ ...fields, purpose_id: 2, version_number: state.revision_type === 'urb_minor' ? research.version_number : String(previous + 1),
      status_id: state.revision_type === 'urb_minor' ? 3 : 1,
      submitted_date: new Date(), updated_by: req.user.id }, { transaction });
    for (const [model, entries] of [[db.ResearchInvestigators, req.body.research_investigators], [db.BudgetBreakdowns, req.body.budget_breakdowns]]) {
      await model.destroy({ where: { research_id: research.id }, transaction });
      const allowed = model === db.ResearchInvestigators ?
        ['id_number', 'first_name', 'middle_name', 'last_name', 'mobile_number', 'email', 'college', 'dept'] : ['fund_id', 'amount'];
      await model.bulkCreate(entries.map(entry => ({
        ...Object.fromEntries(allowed.filter(key => entry[key] !== undefined).map(key => [key, entry[key]])),
        research_id: research.id, created_by: req.user.id,
      })), { transaction });
    }
    const minorRevision = state.revision_type === 'urb_minor';
    for (const entry of endorsements) {
      const isUrb = Number(entry.User?.UserAccount?.role_id) === 8;
      if (minorRevision) {
        if (isUrb) await entry.update({ status_id: 4, remarks: null, updated_by: req.user.id }, { transaction });
      } else if (isUrb) await entry.destroy({ transaction });
      else await entry.update({ status_id: 4, remarks: null, updated_by: req.user.id }, { transaction });
    }
    await researchEvent(research, 'resubmitted', req.user, transaction);
    return { message: minorRevision ? 'Minor edits resubmitted to the assigned URB reviewers. Version unchanged.' :
      'Revised research resubmitted to the coordinator.', Research: research,
      workflow: workflow(research, minorRevision ? endorsements : [], actor.id, 2) };
  }),
};
module.exports = { ResearchWorkflowController };
