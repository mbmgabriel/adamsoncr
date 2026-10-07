'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CAssistanceFormProofs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.CAssistanceFormProofs.belongsTo(models.RequestAssistanceForms, {
        foreignKey: "request_assistance_form_id",
      })
      models.CAssistanceFormProofs.belongsTo(models.SAssistanceFormProofs, {
        foreignKey: "proof_id",
      })
    }
  }
  CAssistanceFormProofs.init({
    request_assistance_form_id: DataTypes.INTEGER,
    proof_id: DataTypes.INTEGER,
    is_active: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CAssistanceFormProofs',
  });
  return CAssistanceFormProofs;
};