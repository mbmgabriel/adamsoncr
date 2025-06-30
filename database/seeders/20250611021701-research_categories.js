'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
	await queryInterface.bulkInsert(
      'research_categories',
      [
        {
		  research_name: 'Productivity and Competitiveness in Business and Education',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  research_name: 'Advancement of Science and Technology',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  research_name: 'Integrative Development Approaches in Social Science, Humanities and Communication',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  research_name: 'Community Health and the Effective Delivery of Health Care',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  research_name: 'Environmental Conservation and Preservation',
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
    await queryInterface.bulkDelete('research_categories', null, {});
  }
};
