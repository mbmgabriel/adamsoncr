'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user_accounts', 'email', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('users', 'contact_number', {
      type: Sequelize.STRING
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_accounts', 'email');
    await queryInterface.removeColumn('users', 'contact_number');
  }
};
