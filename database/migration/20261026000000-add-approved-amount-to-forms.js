"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of ["incentive_forms", "request_assistance_forms"]) {
      await queryInterface.addColumn(table, "approved_amount", { type: Sequelize.DECIMAL(12, 2), allowNull: true });
    }
  },
  async down(queryInterface) {
    for (const table of ["request_assistance_forms", "incentive_forms"]) {
      await queryInterface.removeColumn(table, "approved_amount");
    }
  }
};
