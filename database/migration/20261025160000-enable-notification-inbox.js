'use strict';
module.exports = {
  async up(q, S) {
    // Existing rows receive unique keys too, so neither dialect needs a nullable unique index.
    await q.addColumn('notifications', 'event_type', { type: S.STRING(60) });
    await q.addColumn('notifications', 'application_type', { type: S.STRING(20) });
    await q.addColumn('notifications', 'application_id', { type: S.INTEGER });
    await q.addColumn('notifications', 'target_path', { type: S.STRING(255) });
    await q.addColumn('notifications', 'dedupe_key', { type: S.STRING(255) });
    await q.sequelize.query("UPDATE notifications SET dedupe_key = CONCAT('legacy:', id) WHERE dedupe_key IS NULL");
    await q.addIndex('notifications', ['dedupe_key'], { unique: true, name: 'notifications_dedupe_key' });
    await q.addIndex('notifications', ['user_account_id', 'created_at', 'id'], { name: 'notifications_recipient_date' });
  },
  async down(q) {
    await q.removeIndex('notifications', 'notifications_recipient_date');
    await q.removeIndex('notifications', 'notifications_dedupe_key');
    for (const column of ['event_type', 'application_type', 'application_id', 'target_path', 'dedupe_key']) await q.removeColumn('notifications', column);
  },
};
