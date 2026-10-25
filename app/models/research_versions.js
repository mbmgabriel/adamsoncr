'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResearchVersions extends Model {
    static associate(models) {
      this.belongsTo(models.Research, { foreignKey: 'research_id' });
    }
  }
  ResearchVersions.init({
    research_id: DataTypes.INTEGER,
    version_number: DataTypes.STRING,
    snapshot: DataTypes.TEXT('long'),
    created_by: DataTypes.INTEGER,
  }, { sequelize, modelName: 'ResearchVersions' });
  return ResearchVersions;
};
