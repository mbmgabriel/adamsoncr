'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'budget_breakdown_details',
      [
        {
          fund_name: 'Transportation',
          fund_desc: 'Transportation',
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          fund_name: 'Meal (Consultants and Respondents)',
          fund_desc: 'Meal (Consultants and Respondents)',
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          fund_name: 'Supplies and Materials needed',
          fund_desc: 'Supplies and Materials needed',
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          fund_name: 'Analysis and Laboratory Test',
          fund_desc: 'Analysis and Laboratory Test',
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          fund_name: 'Others',
          fund_desc: 'Others',
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('budget_breakdown_details', null, {});
  }
};
