'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Endorsements extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Endorsements.belongsTo(models.Research, {
        foreignKey: "research_id",
      });
      models.Endorsements.belongsTo(models.User, {
        foreignKey: "endorsement_rep_id",
      });
      models.Endorsements.belongsTo(models.StatusTables, {
        foreignKey: "status_id",
      });
      // models.Endorsements.belongsTo(models.EndorsementRepresentative, {
      //   foreignKey: "endorsement_rep_id",
      // });
    }
  }
  Endorsements.init({
    research_id: DataTypes.INTEGER,
    endorsement_rep_id: DataTypes.INTEGER,
    // endorsement_rep_name: DataTypes.STRING,
    // status: DataTypes.STRING,
    status_id: DataTypes.INTEGER,
    remarks: DataTypes.TEXT,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Endorsements',
  });
  return Endorsements;
};