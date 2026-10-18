'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.FormTypes.hasMany(models.Endorsements, {
        foreignKey: "form_type_id",
      });
    }
  }
  FormTypes.init({
    form_type: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FormTypes',
  });
  return FormTypes;
};