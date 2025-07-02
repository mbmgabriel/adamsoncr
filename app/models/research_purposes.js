'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResearchPurpose extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ResearchPurpose.hasOne(models.Research, {
        foreignKey: "purpose_id",
      });
    }
  }
  ResearchPurpose.init({
    purpose_name: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ResearchPurpose',
  });
  return ResearchPurpose;
};