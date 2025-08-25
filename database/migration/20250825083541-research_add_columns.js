'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('endorsements', 'remarks', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('research', 'status', {
      type: Sequelize.STRING,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('endorsements', 'remarks');
    await queryInterface.removeColumn('research', 'status');
  }
};
