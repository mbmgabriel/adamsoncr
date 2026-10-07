'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SPeerReviewProof extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.SPeerReviewProof.hasMany(models.IncentiveForms, { foreignKey: 'peer_review_proof_id' });
    }
  }
  SPeerReviewProof.init({
    name: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'SPeerReviewProof',
  });
  return SPeerReviewProof;
};