'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('devadmin', 10);
    const hashedPs = await bcrypt.hash('password', 10);
    await queryInterface.bulkInsert(
      'user_accounts',
      [
        {
          username: 'devadmin',
          password: hashedPassword,
          role_id: 1,
          email: "sample@mailinator.com",
          verified_at: new Date(),
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          username: 'sample_user',
          password: hashedPs,
          role_id: 2,
          email: "sample2@mailinator.com",
          verified_at: new Date(),
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          username: 'sample_rc',
          password: hashedPs,
          role_id: 3,
          email: "sample3@mailinator.com",
          verified_at: new Date(),
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          username: 'sample_cp',
          password: hashedPs,
          role_id: 4,
          email: "sample4@mailinator.com",
          verified_at: new Date(),
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          username: 'sample_dean',
          password: hashedPs,
          role_id: 5,
          email: "sample5@mailinator.com",
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
          last_name: "Luna",
          first_name: "Antonio",
          middle_name: "Ancheta",
          contact_number: "09123456789",
          dept_id: 1,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          user_account_id: 2,
          last_name: "Lopez",
          first_name: "Adrian",
          middle_name: "Cabrera",
          contact_number: "09241259918",
          dept_id: 1,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          user_account_id: 3,
          last_name: "Santos",
          first_name: "Aitana",
          middle_name: "Alvarez",
          contact_number: "09156890020",
          dept_id: 1,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          user_account_id: 4,
          last_name: "Juarez",
          first_name: "Mazikee",
          middle_name: "Wu",
          contact_number: "09178852910",
          dept_id: 1,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          user_account_id: 5,
          last_name: "Torres",
          first_name: "Ledger",
          middle_name: "Rivera",
          contact_number: "09285721539",
          dept_id: 1,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
      ],
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_accounts', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
