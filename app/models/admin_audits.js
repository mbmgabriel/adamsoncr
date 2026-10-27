module.exports = (sequelize, D) => sequelize.define('AdminAudit', {
  actor_id: D.INTEGER,
  actor_name: D.STRING,
  action: D.STRING,
  resource: D.STRING,
  resource_id: D.INTEGER,
  changes: D.TEXT
}, {
  tableName: 'admin_audits'
});
