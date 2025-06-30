'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
	await queryInterface.bulkInsert(
      'endorsement_representatives',
      [
        {
		  rep_name: 'College Research Coordinator',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  rep_name: 'Department Chairperson',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  rep_name: 'College Dean',
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
    await queryInterface.bulkDelete('endorsement_representatives', null, {});
  }
};
