'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Processes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Processes.belongsTo(models.UserRole, {
        foreignKey: "from_id",
        as: "From",
        targetKey: "id",
      });
      models.Processes.belongsTo(models.UserRole, {
        foreignKey: "to_id",
        as: "To",
        targetKey: "id",
      });
    }
  }
  Processes.init({
    from_id: DataTypes.INTEGER,
    to_id: DataTypes.INTEGER,
    action: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Processes',
  });
  return Processes;
};