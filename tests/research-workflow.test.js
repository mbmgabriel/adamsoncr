const test = require('node:test');
const assert = require('node:assert/strict');
const { workflow } = require('../app/services/research/workflow');
const research = { created_by: 2, status_id: 1, version_number: '1' };
const row = (role, status = 4, id = role) => ({ endorsement_rep_id: id, status_id: status, User: { UserAccount: { role_id: role } } });
const departmental = [3, 4, 5, 6].map(role => row(role, 6));

test('review sequence only enables the next assigned departmental role', () => {
  for (const role of [3, 4, 5, 6]) {
    const rows = [3, 4, 5, 6, 7].map(r => row(r, r < role ? 6 : 4));
    assert.equal(workflow(research, rows, role, role).can_endorse, true);
    for (const later of [3, 4, 5, 6].filter(r => r > role)) assert.equal(workflow(research, rows, later, later).can_endorse, false);
  }
});
test('only coordinator requests revision during departmental review', () => {
  assert.equal(workflow(research, [row(3)], 3, 3).can_request_revision, true);
  assert.equal(workflow(research, [row(3, 6), row(4)], 4, 4).can_request_revision, false);
});
test('revision pauses all reviewers and enables only the owner to resubmit', () => {
  const revised = { ...research, status_id: 5 };
  const rows = [row(3, 5), row(4), row(6), row(7)];
  for (const role of [3, 4, 6, 7]) {
    const state = workflow(revised, rows, role, role);
    assert.equal(state.can_endorse, false);
    assert.equal(state.can_assign_urb, false);
    assert.equal(state.stage, 'revision_required');
  }
  assert.equal(workflow(revised, rows, 2, 2).can_resubmit, true);
  assert.equal(workflow(revised, rows, 99, 2).can_resubmit, false);
});
test('assigned staff can assign after dean endorsement without separately endorsing', () => {
  const rows = [...departmental, row(7)];
  const state = workflow(research, rows, 6, 6);
  assert.equal(workflow(research, rows, 7, 7).can_assign_urb, false);
  assert.equal(workflow(research, rows, 99, 6).can_assign_urb, false);
  assert.equal(workflow(research, [row(3, 6), row(4, 6), row(5, 6), row(6)], 6, 6).can_assign_urb, true);
  for (const missing of [3, 4, 5]) {
    assert.equal(workflow(research, rows.map(entry => entry.endorsement_rep_id === missing ? row(missing) : entry), 6, 6).can_assign_urb, false);
  }
  assert.equal(state.can_assign_urb, true);
  assert.equal(state.can_endorse, false);
  assert.equal(state.can_complete, false);
  assert.equal(state.stage, 'urb_assignment');
});
test('completion requires at least two assigned URB members and all approvals', () => {
  for (const urb of [[], [row(8, 6, 10)], [row(8, 6, 10), row(8, 4, 11)], [row(8, 6, 10), row(8, 6, 11), row(8, 4, 12)]]) {
    assert.equal(workflow(research, [...departmental, row(7, 4), ...urb], 7, 7).can_complete, false);
  }
  const rows = [...departmental, row(7, 4), row(8, 6, 10), row(8, 6, 11), row(8, 6, 12)];
  assert.equal(workflow(research, rows, 7, 7).can_complete, true);
  assert.equal(workflow(research, rows, 10, 8).can_complete, false);
});
test('only a pending assigned URB member can approve', () => {
  const rows = [...departmental, row(7, 4), row(8, 6, 10), row(8, 4, 11)];
  assert.equal(workflow(research, rows, 10, 8).can_approve_urb, false);
  assert.equal(workflow(research, rows, 11, 8).can_approve_urb, true);
  assert.equal(workflow(research, rows, 12, 8).can_approve_urb, false);
});
test('completed research permits no further workflow actions', () => {
  for (const role of [2, 3, 4, 5, 6, 7, 8]) {
    const state = workflow({ ...research, status_id: 2 }, [...departmental, row(7, 4), row(8, 6, 10), row(8, 6, 11)], role, role);
    assert.equal(state.stage, 'completed');
    for (const key of ['can_endorse', 'can_request_revision', 'can_assign_urb', 'can_approve_urb', 'can_complete', 'can_resubmit']) assert.equal(state[key], false);
  }
});


test('assigned pending URB reviewers can request minor revision', () => {
  const rows = [...departmental, row(7), row(8, 6, 10), row(8, 4, 11)];
  assert.equal(workflow(research, rows, 11, 8).can_request_revision, true);
  for (const [actor, role] of [[10, 8], [12, 8], [6, 6], [7, 7]]) {
    assert.equal(workflow(research, rows, actor, role).can_request_revision, false);
  }
  assert.equal(workflow(research, [row(8, 4, 11)], 11, 8).can_request_revision, false);
});

test('URB revision exposes minor route and remarks and pauses review until owner resubmits', () => {
  const rows = [...departmental, row(7), row(8, 6, 10), { ...row(8, 5, 11), remarks: 'Fix the abstract.' }];
  const revised = { ...research, status_id: 5 };
  const owner = workflow(revised, rows, 2, 2);
  assert.equal(owner.revision_type, 'urb_minor');
  assert.equal(owner.version_number, '1');
  assert.equal(owner.revision_remarks, 'Fix the abstract.');
  assert.equal(owner.can_resubmit, true);
  for (const role of [3, 4, 5, 6, 7, 8]) {
    const state = workflow(revised, rows, role === 8 ? 11 : role, role);
    for (const action of ['can_endorse', 'can_request_revision', 'can_assign_urb', 'can_approve_urb', 'can_complete', 'can_resubmit']) {
      assert.equal(state[action], false);
    }
  }
  assert.equal(workflow(revised, [row(3, 5)], 2, 2).revision_type, 'coordinator');
});
