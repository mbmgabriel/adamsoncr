'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.belongsTo(models.UserAccount, {
        foreignKey: "user_account_id",
      }),
      models.User.belongsTo(models.Departments, {
        foreignKey: "dept_id",
      }),
      models.User.hasMany(models.Research, {
        foreignKey: "created_by"
      })
    }
  }
  User.init({
    user_account_id: DataTypes.INTEGER,
    last_name: DataTypes.STRING,
    first_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    // position: DataTypes.STRING,
    // dept: DataTypes.STRING,
    // college: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    dept_id: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};