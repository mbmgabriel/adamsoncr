'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Research extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Research.belongsTo(models.ResearchPurpose, {
        foreignKey: "purpose_id",
      }),
      models.Research.hasMany(models.ResearchInvestigators, {
        foreignKey: "research_id",
      }),
      models.Research.hasMany(models.ResearchDocuments, {
        foreignKey: "research_id",
      }),
      models.Research.hasMany(models.Endorsements, {
        foreignKey: "research_id",
      });
    }
  }
  Research.init({
    title: DataTypes.TEXT,
    category: DataTypes.STRING,
    purpose_id: DataTypes.INTEGER,
    version_number: DataTypes.STRING,
    research_duration: DataTypes.STRING,
    ethical_considerations: DataTypes.INTEGER,
    submitted_by: DataTypes.STRING,
    submitted_date: DataTypes.DATE,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Research',
  });
  return Research;
};