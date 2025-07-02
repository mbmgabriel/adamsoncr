'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResearchDocuments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ResearchDocuments.belongsTo(models.Research, {
        foreignKey: "research_id",
      }),
      models.ResearchDocuments.belongsTo(models.DocumentTypes, {
        foreignKey: "document_title_id",
      });
    }
  }
  ResearchDocuments.init({
    research_id: DataTypes.INTEGER,
    document_title_id: DataTypes.INTEGER,
    document_filepath: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ResearchDocuments',
  });
  return ResearchDocuments;
};