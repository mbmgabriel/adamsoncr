module.exports = (sequelize, D) => sequelize.define('SiteContent', {
  kind: D.STRING,
  title: D.STRING,
  body: D.TEXT,
  published: D.BOOLEAN
}, {
  tableName: 'site_contents'
});
