'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'status_tables',
      [
        {
          status: 'On-going',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          status: 'Completed',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          status: 'For Approval',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          status: 'Not yet Reviewed',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          status: 'Reevaluate',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          status: 'Endorsed',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          status: 'Presented',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          status: 'Published',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          status: 'Presented and Published',
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
    await queryInterface.bulkDelete('status_tables', null, {});
  }
};
