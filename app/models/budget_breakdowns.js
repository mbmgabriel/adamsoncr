'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BudgetBreakdowns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.BudgetBreakdowns.belongsTo(models.BudgetBreakdownDetail, {
        foreignKey: "fund_id",
      });
    }
  }
  BudgetBreakdowns.init({
    research_id: DataTypes.INTEGER,
    fund_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'BudgetBreakdowns',
  });
  return BudgetBreakdowns;
};