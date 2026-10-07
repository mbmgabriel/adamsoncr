'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CAttachmentInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.CAttachmentInfos.belongsTo(models.IncentiveForms, { foreignKey: 'incentive_form_id' });
      models.CAttachmentInfos.belongsTo(models.SAttachmentInfos, { foreignKey: 'info_id' });
    }
  }
  CAttachmentInfos.init({
    incentive_form_id: DataTypes.INTEGER,
    info_id: DataTypes.INTEGER,
    is_active: DataTypes.INTEGER,
    attachment_file: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CAttachmentInfos',
  });
  return CAttachmentInfos;
};