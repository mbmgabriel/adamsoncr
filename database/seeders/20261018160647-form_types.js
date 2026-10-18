'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'form_types',
      [
        {
          id: 1,
          form_type: 'Research',
          description: 'New Research Application',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          id: 2,
          form_type: 'RequestAssistanceForms',
          description: 'RESEARCH PAPER PRESENTATION REQUEST FOR ASSISTANCE FORM',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          id: 3,
          form_type: 'IncentiveForms',
          description: 'RESEARCH PUBLICATION, CITATION, AND H-INDEX INCENTIVE FORM',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('form_types', null, {});
  }
};
