'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('devadmin', 10);
    await queryInterface.bulkInsert(
      'user_accounts',
      [
        {
          username: 'devadmin',
          password: hashedPassword,
          role_id: 1,
          verified_at: new Date(),
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
      ],
      { ignoreDuplicates: true } 
    );
    await queryInterface.bulkInsert(
      'users',
      [
        {
          user_account_id: 1,
          last_name: "Dela Cruz",
          first_name: "Juan",
          middle_name: "Santos",
          position: "Admin",
          dept: "CRD",
          college: "",
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
      ],
      { ignoreDuplicates: true } 
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_accounts', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
