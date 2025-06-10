'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'user_roles',
      [
        {
          role_name: 'Administrator',
          role_desc: 'Admin',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'Researcher',
          role_desc: 'Researcher',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'Research Coordinator',
          role_desc: 'Research Coordinator',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'Chairperson',
          role_desc: 'Chairperson',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'Dean',
          role_desc: 'Dean',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'CRD Staff',
          role_desc: 'CRD Staff',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'University Review Board',
          role_desc: 'Univ Review Board',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'CRD Director',
          role_desc: 'CRD Director',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'ITSO',
          role_desc: 'ITSO',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'LIBRARY',
          role_desc: 'LIBRARY',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'ETHICS',
          role_desc: 'ETHICS',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'REVIEW',
          role_desc: 'REVIEW',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          role_name: 'COMM',
          role_desc: 'COMM',
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
    await queryInterface.bulkDelete('user_roles', null, {});
  }
};
