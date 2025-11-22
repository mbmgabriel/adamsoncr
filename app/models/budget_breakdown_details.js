'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BudgetBreakdownDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.BudgetBreakdownDetails.hasMany(models.BudgetBreakdowns, {
        foreignKey: "fund_id",
      });
    }
  }
  BudgetBreakdownDetails.init({
    fund_name: DataTypes.STRING,
    fund_desc: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'BudgetBreakdownDetails',
  });
  return BudgetBreakdownDetails;
};