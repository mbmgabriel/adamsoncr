require('dotenv').config();
const db = require('../app/models');
const { researchEvent, formEvent, specs } = require('../app/services/notifications/service');
async function backfill() {
  let processed = 0;
  // Small batches avoid loading all applications or holding one long transaction.
  for (const [type, Model] of [['research', db.Research], ...Object.entries(specs).map(([type, spec]) => [type, db[spec.model]])]) {
    let after = 0;
    while (true) {
      const rows = await Model.findAll({ attributes: ['id'], where: { id: { [db.Sequelize.Op.gt]: after } }, order: [['id', 'ASC']], limit: 100 });
      if (!rows.length) break;
      for (const row of rows) {
        await db.sequelize.transaction(async transaction => {
          const application = await Model.findByPk(row.id, { transaction, lock: transaction.LOCK.UPDATE });
          if (!application) return;
          if (type === 'research') await researchEvent(application, 'backfill', null, transaction);
          else await formEvent(type, application, 'backfill', null, transaction);
        });
        processed++;
      }
      after = rows[rows.length - 1].id;
    }
  }
  return processed;
}
if (require.main === module) backfill().then(count => console.log(`Checked ${count} applications for pending notification alerts.`))
  .catch(error => { console.error('Notification backfill failed:', error.name); process.exitCode = 1; }).finally(() => db.sequelize.close());
module.exports = { backfill };
