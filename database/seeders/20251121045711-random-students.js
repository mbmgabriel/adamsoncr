'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);
    await queryInterface.bulkInsert(
      'user_accounts',
      [
        { username: 'sample_user6', password: hashedPassword, role_id: 2, email: 'user6@mailinator.com', verified_at: new Date(), created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { username: 'sample_user7', password: hashedPassword, role_id: 2, email: 'user7@mailinator.com', verified_at: new Date(), created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { username: 'sample_user8', password: hashedPassword, role_id: 2, email: 'user8@mailinator.com', verified_at: new Date(), created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { username: 'sample_user9', password: hashedPassword, role_id: 2, email: 'user9@mailinator.com', verified_at: new Date(), created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { username: 'sample_user10', password: hashedPassword, role_id: 2, email: 'user10@mailinator.com', verified_at: new Date(), created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { username: 'sample_user11', password: hashedPassword, role_id: 2, email: 'user11@mailinator.com', verified_at: new Date(), created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { username: 'sample_user12', password: hashedPassword, role_id: 2, email: 'user12@mailinator.com', verified_at: new Date(), created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { username: 'sample_user13', password: hashedPassword, role_id: 2, email: 'user13@mailinator.com', verified_at: new Date(), created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
      ],
      { ignoreDuplicates: true }
    );
    await queryInterface.bulkInsert(
      'users',
      [
        { user_account_id: 6, last_name: 'Emmie', first_name: 'Jimenez', contact_number: '09911420272', dept_id: 4, created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { user_account_id: 7, last_name: 'Silas', first_name: 'Best', contact_number: '09357388030', dept_id: 1, created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { user_account_id: 8, last_name: 'Lexie', first_name: 'Harper', contact_number: '09709412936', dept_id: 3, created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { user_account_id: 9, last_name: 'Hayes', first_name: 'Duffy', contact_number: '09563166842', dept_id: 3, created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { user_account_id: 10, last_name: 'Addisyn', first_name: 'Reilly', contact_number: '09766874741', dept_id: 4, created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { user_account_id: 11, last_name: 'Alvaro', first_name: 'Elliott', contact_number: '09993364344', dept_id: 4, created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { user_account_id: 12, last_name: 'Noelle', first_name: 'Gutierrez', contact_number: '09504337357', dept_id: 2, created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
        { user_account_id: 13, last_name: 'Luca', first_name: 'Jordan', contact_number: '09285427413', dept_id: 5, created_at: new Date(), created_by: 1, updated_at: new Date(), updated_by: 1 },
      ],
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_accounts', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
