'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notifications.init({
    notification: DataTypes.TEXT,
    event_type: DataTypes.STRING(60),
    application_type: DataTypes.STRING(20),
    application_id: DataTypes.INTEGER,
    target_path: DataTypes.STRING(255),
    dedupe_key: DataTypes.STRING(255),
    user_account_id: DataTypes.INTEGER,
    read_status: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'notifications',
  });
  return notifications;
};