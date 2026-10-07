'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RequestAssistanceForms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.RequestAssistanceForms.hasMany(models.CAssistanceFormProofs, {
        foreignKey: "request_assistance_form_id",
      })
      models.RequestAssistanceForms.belongsTo(models.User, {
        foreignKey: "created_by",
      })
    }
  }
  RequestAssistanceForms.init({
    name_of_presenter: DataTypes.STRING,
    email_address: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    conference_title: DataTypes.STRING,
    research_paper_title: DataTypes.STRING,
    conference_link: DataTypes.STRING,
    acceptance_date: DataTypes.DATE,
    conference_date: DataTypes.DATE,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'RequestAssistanceForms',
  });
  return RequestAssistanceForms;
};