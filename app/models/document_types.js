'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.DocumentTypes.hasMany(models.ResearchDocuments, {
        foreignKey: "document_title_id",
      });
    }
  }
  DocumentTypes.init({
    document_name: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'DocumentTypes',
  });
  return DocumentTypes;
};