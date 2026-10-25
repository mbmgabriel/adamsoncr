const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const controllerSource = fs.readFileSync(
  path.join(__dirname, '../app/controllers/research/research_controller.js'), 'utf8'
);

// Exercise the controller's query and response flow without a live database.
async function listResearch(roleId, statuses) {
  const reviewerId = 100;
  const researchId = 42;
  const models = {
    sequelize: { transaction: async (callback) => callback({}) },
    Endorsements: {
      findAll: async (query) => {
        assert.equal(query.where.form_type_id, 1);
        if (query.where.endorsement_rep_id) {
          assert.equal(query.where.endorsement_rep_id, reviewerId);
          return [{ research_id: researchId }];
        }
        assert.deepEqual(Array.from(query.where.research_id), [researchId]);
        return Object.entries(statuses).map(([role, status]) => ({
          research_id: researchId,
          status_id: status,
          User: { UserAccount: { role_id: Number(role) } },
        }));
      },
    },
    Research: {
      findAll: async (query) => {
        assert.equal(JSON.stringify(query.order), JSON.stringify([
          ['submitted_date', 'DESC'], ['created_at', 'DESC'], ['id', 'DESC'],
        ]));
        const endorsementFilter = query.include.find(
          (include) => include.model === models.Endorsements
        );
        assert.equal(endorsementFilter.where.endorsement_rep_id, reviewerId);
        assert.equal(endorsementFilter.where.form_type_id, 1);
        return Array.from(query.where.id, (id) => ({ id }));
      },
    },
  };
  const context = {
    module: { exports: {} },
    require: (name) => {
      if (name === '../../models') return models;
      if (name === 'sequelize') return { Op: {} };
      if (name.endsWith('/status_codes')) return { OK: 200, INTERNAL_SERVER_ERROR: 500 };
      if (name.endsWith('/research_validator')) return {};
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  vm.runInNewContext(controllerSource, context);
  let statusCode;
  let response;
  const res = {
    status(code) { statusCode = code; return this; },
    json(body) { response = body; },
  };
  await context.module.exports.ResearchController.all(
    { user: { id: reviewerId, role_id: roleId } }, res
  );
  assert.equal(statusCode, 200, JSON.stringify(response));
  return response.map((research) => research.id);
}

test('CRD staff see research awaiting their endorsement after department approvals', async () => {
  assert.deepEqual(await listResearch(6, { 3: 6, 4: 6, 5: 6, 6: 4, 7: 4 }), [42]);
});

test('CRD director sees research awaiting their endorsement after CRD staff approval', async () => {
  assert.deepEqual(await listResearch(7, { 3: 6, 4: 6, 5: 6, 6: 6, 7: 4 }), [42]);
});

for (const roleId of [6, 7]) {
  for (const prerequisite of (roleId === 6 ? [3, 4, 5] : [3, 4, 5, 6])) {
    test(`role ${roleId} waits for prerequisite role ${prerequisite}`, async () => {
      const statuses = { 3: 6, 4: 6, 5: 6, 6: 6, 7: 6 };
      statuses[prerequisite] = 4;
      assert.deepEqual(await listResearch(roleId, statuses), []);
      delete statuses[prerequisite];
      assert.deepEqual(await listResearch(roleId, statuses), []);
    });
  }
  test(`role ${roleId} retains visibility after endorsing`, async () => {
    assert.deepEqual(await listResearch(roleId, { 3: 6, 4: 6, 5: 6, 6: 6, 7: 6 }), [42]);
  });
}

test('department reviewers retain their existing review sequence', async () => {
  assert.deepEqual(await listResearch(3, { 3: 4, 4: 4, 5: 4 }), [42]);
  assert.deepEqual(await listResearch(4, { 3: 4, 4: 4, 5: 4 }), []);
  assert.deepEqual(await listResearch(4, { 3: 6, 4: 4, 5: 4 }), [42]);
  assert.deepEqual(await listResearch(5, { 3: 6, 4: 4, 5: 4 }), []);
  assert.deepEqual(await listResearch(5, { 3: 6, 4: 6, 5: 4 }), [42]);
});
