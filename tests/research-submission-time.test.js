const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../app/controllers/research/research_controller.js'), 'utf8');

function loadController(models) {
  const context = {
    module: { exports: {} },
    require(name) {
      if (name === '../../models') return models;
      if (name === 'sequelize') return { Op: {} };
      if (name.endsWith('/status_codes')) return { CREATED: 201, OK: 200, INTERNAL_SERVER_ERROR: 500 };
      if (name.endsWith('/research_validator')) return { researchValidator: () => ({ validate: () => true }) };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  vm.runInNewContext(source, context);
  return context.module.exports.ResearchController;
}

function response() {
  return {
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; },
  };
}

for (const method of ['create', 'comprehensiveCreate']) {
  for (const date of ['2020-01-01', '2020-01-01T00:00:00Z', undefined]) {
    test(`${method} records server submission time for input ${date}`, async () => {
      let saved;
      const controller = loadController({
        sequelize: { transaction: async (callback) => callback({}) },
        User: { findOne: async () => ({ dept_id: 1 }), findAll: async () => [] },
        Research: { create: async (values) => { saved = values; return values; } },
      });
      const res = response();
      const before = Date.now();
      await controller[method]({ user: { id: 1, role_id: 2 }, body: { title: 'Submission timestamp test', submitted_date: date } }, res);
      assert.equal(res.code, 201, JSON.stringify(res.body));
      assert.ok(saved.submitted_date.getTime() >= before);
      assert.ok(saved.submitted_date.getTime() <= Date.now());
      assert.match(saved.submitted_date.toISOString(), /T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  }
}

test('generic edits cannot bypass the research revision workflow', async () => {
  const timestamp = '2026-10-25T07:23:45.000Z';
  let saved;
  const controller = loadController({
    sequelize: { transaction: async (callback) => callback({}) },
    Research: { findOne: async () => ({
      submitted_date: timestamp,
      update: async (values) => { saved = values; },
    }) },
  });
  const res = response();
  await controller.update({ user: { id: 1, role_id: 2 }, params: { id: 1 }, body: { title: 'Edited', submitted_date: '2026-10-25' } }, res);
  assert.equal(res.code, 409, JSON.stringify(res.body));
  assert.equal(saved, undefined);
});

for (const method of ['create', 'comprehensiveCreate']) {
  test(`${method} assigns each reviewer once when CRD reviewers share the department`, async () => {
    const users = [
      { id: 3, role: 3, dept: 1 }, { id: 4, role: 4, dept: 1 },
      { id: 5, role: 5, dept: 1 }, { id: 6, role: 6, dept: 1 },
      { id: 7, role: 7, dept: 1 }, { id: 8, role: 3, dept: 2 },
      { id: 9, role: 6, dept: 2 },
    ];
    let saved;
    const controller = loadController({
      sequelize: { transaction: async (callback) => callback({}) },
      User: {
        findOne: async () => ({ dept_id: 1 }),
        findAll: async (query) => users.filter((user) =>
          query.include[0].where.role_id.includes(user.role) &&
          (!query.where || user.dept === query.where.dept_id)),
      },
      Research: { create: async (values) => { saved = values; return values; } },
    });
    const res = response();
    await controller[method]({ user: { id: 1, role_id: 2 }, body: { title: 'Unique endorsements' } }, res);
    assert.equal(res.code, 201, JSON.stringify(res.body));
    assert.equal(JSON.stringify(saved.Endorsements.map((row) => row.endorsement_rep_id)), '[3,4,5,6,7,9]');
    assert.ok(saved.Endorsements.every((row) => row.form_type_id === 1 && row.status_id === 4));
  });
}
