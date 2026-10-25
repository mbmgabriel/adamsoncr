require('dotenv').config();
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('../app/models');

async function seed() {
  if (!['127.0.0.1', 'localhost'].includes(process.env.DB_HOST) ||
      process.env.DB_DATABASE !== 'adamsoncr_local' || process.env.NODE_ENV === 'production') {
    throw new Error('Local fixtures require localhost and database adamsoncr_local.');
  }
  db.sequelize.options.logging = false;
  const referenceSeeds = [
    ['UserRole', '20250606111435-user_roles.js'],
    ['Departments', '20251118144352-departments.js'],
    ['ResearchPurpose', '20250611021147-research_purposes.js'],
    ['ResearchCategory', '20250611021701-research_categories.js'],
    ['DocumentTypes', '20250611022918-document_types.js'],
    ['BudgetBreakdownDetails', '20251111131116-budget-breakdown-details.js'],
    ['StatusTables', '20251122021644-status_table.js'],
    ['FormTypes', '20261018160647-form_types.js'],
    ['Processes', '20260421122915-default_process.js'],
    ['SAssistanceFormProofs', '20261007092454-s_assistance_form_proofs.js'],
    ['SIncentiveTypes', '20261007173351-incentive-form-static.js'],
  ];
  for (const [model, filename] of referenceSeeds) {
    if (!db[model]) throw new Error(`Unknown reference model: ${model}`);
    if (await db[model].count() === 0) {
      await require(`../database/seeders/${filename}`).up(db.sequelize.getQueryInterface(), Sequelize);
    }
  }
  // Shared form statuses: Approved applies to assistance and incentive forms.
  for (const [id, status] of [[10, 'Approved'], [11, 'Rejected']]) {
    await db.StatusTables.findOrCreate({ where: { id }, defaults: { status, created_by: 1 } });
  }
  const accounts = [
    ['local_admin', 1, 'Admin'],
    ['local_researcher', 2, 'Researcher'],
    ['local_rc', 3, 'Research Coordinator'],
    ['local_chair', 4, 'Chairperson'],
    ['local_dean', 5, 'Dean'],
    ['local_crd_staff', 6, 'CRD Staff'],
    ['local_crd_director', 7, 'CRD Director'],
    ['local_urb_1', 8, 'URB Member One'],
    ['local_urb_2', 8, 'URB Member Two'],
    ['local_urb_3', 8, 'URB Member Three'],
  ];
  const password = await bcrypt.hash('password', 10);
  const usersByRole = {};
  const usersByName = {};
  await db.sequelize.transaction(async (transaction) => {
    for (const [username, roleId, name] of accounts) {
      let account = await db.UserAccount.findOne({ where: { username }, transaction });
      if (!account) {
        account = await db.UserAccount.create({
          username, password, role_id: roleId, email: `${username}@example.test`,
          verified_at: new Date(), created_by: 1,
        }, { transaction });
      }
      let user = await db.User.findOne({ where: { user_account_id: account.id }, transaction });
      if (!user) {
        // Existing controllers use account IDs when matching endorsement user IDs.
        user = await db.User.create({
          id: account.id, user_account_id: account.id, first_name: 'Local', last_name: name,
          dept_id: 1, created_by: 1,
        }, { transaction });
      }
      usersByRole[roleId] = user.id;
      usersByName[username] = user.id;
    }
    const category = await db.ResearchCategory.findOne({ transaction });
    for (const [title, approvedRoles] of [
      ['LOCAL TEST - Awaiting dean review', [3, 4]],
      ['LOCAL TEST - Awaiting CRD staff review', [3, 4, 5]],
      ['LOCAL TEST - Awaiting CRD director review', [3, 4, 5, 6]],
    ]) {
      const existing = await db.Research.findOne({ where: { title }, transaction });
      if (existing) {
        if (existing.category === category.research_name) await existing.update({ category: String(category.id) }, { transaction });
        continue;
      }
      const research = await db.Research.create({
        title, category: String(category.id), purpose_id: 1, version_number: '1',
        research_duration: '6 months', ethical_considerations: 0,
        submitted_by: 'Local Researcher', submitted_date: new Date(), status_id: 1,
        created_by: usersByRole[2],
      }, { transaction });
      await db.Endorsements.bulkCreate([3, 4, 5, 6, 7].map((roleId) => ({
        research_id: research.id, form_type_id: 1, endorsement_rep_id: usersByRole[roleId],
        status_id: approvedRoles.includes(roleId) ? 6 : 4, created_by: usersByRole[2],
      })), { transaction });
    }
    for (const [title, approved] of [
      ['LOCAL TEST - Awaiting URB approvals', false],
      ['LOCAL TEST - Ready for director completion', true],
    ]) {
      const existing = await db.Research.findOne({ where: { title }, transaction });
      if (existing) {
        if (existing.category === category.research_name) await existing.update({ category: String(category.id) }, { transaction });
        continue;
      }
      const research = await db.Research.create({ title, category: String(category.id), purpose_id: 1,
        version_number: '1', research_duration: '6 months', ethical_considerations: 0,
        submitted_by: 'Local Researcher', submitted_date: new Date(), status_id: 3,
        created_by: usersByRole[2] }, { transaction });
      await db.Endorsements.bulkCreate([
        ...[3, 4, 5, 6, 7].map(role => ({ endorsement_rep_id: usersByRole[role], status_id: role === 7 ? 4 : 6 })),
        ...['local_urb_1', 'local_urb_2'].map(username => ({ endorsement_rep_id: usersByName[username], status_id: approved ? 6 : 4 })),
      ].map(entry => ({ ...entry, research_id: research.id, form_type_id: 1, created_by: 1 })), { transaction });
    }
  });
  console.log('Local accounts and review fixtures are ready. Password: password');
  console.log(accounts.map(([username]) => username).join('\n'));
}

seed().catch((error) => { console.error(error.message); process.exitCode = 1; })
  .finally(() => db.sequelize.close());
