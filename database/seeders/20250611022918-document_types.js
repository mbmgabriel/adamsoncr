'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
	await queryInterface.bulkInsert(
      'document_types',
      [
        {
		  document_name: 'Letter of Intent',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  document_name: 'Research Proposal',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  document_name: 'Researcher/s Curriculum Vitae (CV)',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  document_name: 'Initial Review and Screening',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  document_name: 'Ethics Review',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  document_name: 'Gantt Chart',
		  created_at: new Date(),
		  created_by: 1,
		  updated_at: new Date(),
		  updated_by: 1,
		},
		{
		  document_name: 'Detailed Budget Breakdown',
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
    await queryInterface.bulkDelete('document_types', null, {});
  }
};
