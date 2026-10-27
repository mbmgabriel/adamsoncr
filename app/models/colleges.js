module.exports = (sequelize, D) => sequelize.define('Colleges', {
  name: D.STRING,
  name_key: D.STRING,
  initials: D.STRING,
  active: D.BOOLEAN
}, {
  tableName: 'colleges'
});
