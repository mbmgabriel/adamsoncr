const REVIEW_ROLES = [3, 4, 5, 6];

function workflow(research, endorsements, actorId, actorRole) {
  const role = Number(actorRole);
  const rows = endorsements.map(e => ({
    id: e.id, user_id: e.endorsement_rep_id,
    role_id: Number(e.User?.UserAccount?.role_id), status_id: Number(e.status_id),
    remarks: e.remarks, name: [e.User?.first_name, e.User?.last_name].filter(Boolean).join(' '),
  }));
  const approved = roleId => rows.some(e => e.role_id === roleId && e.status_id === 6);
  const departmentalDone = REVIEW_ROLES.every(approved);
  const assigned = rows.filter(e => e.role_id === 8).sort((a, b) => Number(a.id) - Number(b.id));
  const allUrbApproved = assigned.length >= 2 && assigned.every(e => e.status_id === 6);
  const completed = Number(research.status_id) === 2;
  const revision = Number(research.status_id) === 5;
  const minorRevision = revision && assigned.some(e => e.status_id === 5);
  const canApproveUrb = !completed && !revision && role === 8 && departmentalDone &&
    assigned.length >= 2 && rows.some(e => e.user_id === actorId && e.role_id === 8 && e.status_id !== 6);
  const own = rows.find(e => e.user_id === actorId);
  const owner = research.created_by === actorId;
  const priorDone = REVIEW_ROLES.slice(0, REVIEW_ROLES.indexOf(role)).every(approved);
  const canEndorse = !completed && !revision && REVIEW_ROLES.includes(role) &&
    Boolean(own) && own.status_id !== 6 && priorDone;
  let stage = completed ? 'completed' : revision ? 'revision_required' : 'coordinator_review';
  if (!completed && !revision) {
    const next = REVIEW_ROLES.find(r => !approved(r));
    stage = next ? ({3:'coordinator_review',4:'chair_review',5:'dean_review',6:'staff_review'})[next]
      : !assigned.length ? 'urb_assignment' : allUrbApproved ? 'director_completion' : 'urb_review';
  }
  return {
    stage, version_number: research.version_number, assigned_urb: assigned,
    approved_urb_count: assigned.filter(e => e.status_id === 6).length,
    all_urb_approved: allUrbApproved,
    can_endorse: canEndorse,
    can_request_revision: (canEndorse && role === 3) || canApproveUrb,
    can_assign_urb: !completed && !revision && role === 6 && Boolean(own) && [3, 4, 5].every(approved),
    can_approve_urb: canApproveUrb,
    can_complete: !completed && !revision && role === 7 && Boolean(own) && departmentalDone && allUrbApproved,
    can_resubmit: !completed && revision && owner && role === 2,
    revision_type: revision ? (minorRevision ? 'urb_minor' : 'coordinator') : null,
    revision_remarks: rows.filter(e => e.status_id === 5 && e.role_id === (minorRevision ? 8 : 3))
      .map(e => e.remarks).filter(Boolean).join('\n'),
  };
}
module.exports = { workflow, REVIEW_ROLES };
