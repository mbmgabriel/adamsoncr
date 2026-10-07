'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IncentiveForms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.IncentiveForms.belongsTo(models.SIncentiveTypes, { foreignKey: 'incentive_type_id' });
      models.IncentiveForms.belongsTo(models.SPeerReviewProof, { foreignKey: 'peer_review_proof_id' });
      models.IncentiveForms.hasMany(models.CAttachmentInfos, { foreignKey: 'incentive_form_id' });
    }
  }
  IncentiveForms.init({
    name_of_authors: DataTypes.STRING,
    email_address: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    incentive_type_id: DataTypes.INTEGER,
    submission_date: DataTypes.DATE,
    publisher_info: DataTypes.STRING,
    title_of_work: DataTypes.STRING,
    publication_date: DataTypes.DATE,
    citation_date: DataTypes.DATE,
    citation_no: DataTypes.INTEGER,
    isbn: DataTypes.STRING,
    peer_review_proof_id: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'IncentiveForms',
  });
  return IncentiveForms;
};