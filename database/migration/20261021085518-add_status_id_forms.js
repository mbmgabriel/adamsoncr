'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'incentive_forms',
      'status_id',
      {
        type: Sequelize.INTEGER,
      }
    );
    await queryInterface.addColumn(
      'request_assistance_forms',
      'status_id',
      {
        type: Sequelize.INTEGER,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'incentive_forms',
      'status_id'
    );
    await queryInterface.removeColumn(
      'request_assistance_forms',
      'status_id'
    );
  }
};
