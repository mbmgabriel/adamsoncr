'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      's_assistance_form_proofs',
      [
        {
          name: 'Notice of Acceptance to Paper Presentation and Publication',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'Copy of abstract of accepted paper',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'Copy of Conference Program (if available)',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'A brief description of how the faculty member plans to manage the classes to be missed while on official business.',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'For conferences outside Metro Manila, an itinerary that includes the program of activities, arrival and departure dates, and the presenter\'s return date in their work at the university.',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('s_assistance_form_proofs', null, {});
  }
};
