'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    	await queryInterface.bulkInsert(
      'research_purposes',
      [
        {
		  purpose_name: 'Initial',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  purpose_name: 'Resubmission',
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
    await queryInterface.bulkDelete('research_purposes', null, {});
  }
};
