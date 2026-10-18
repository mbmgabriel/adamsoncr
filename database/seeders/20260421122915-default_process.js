'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'processes',
      [
        {
          from_id: 2,
          action: 1,
          to_id: 3,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'progress',
        },
        {
          from_id: 3,
          action: 1,
          to_id: 4,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'progress',
        },

        {
          from_id: 3,
          action: 2,
          to_id: 2,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'revert',
        },

        {
          from_id: 2,
          action: 3,
          to_id: 3,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'return',
        },

        {
          from_id: 4,
          action: 1,
          to_id: 5,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'progress',
        },

        {
          from_id: 5,
          action: 1,
          to_id: 6,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'progress',
        },

        {
          from_id: 6,
          action: 1,
          to_id: 7,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'progress',
        },

        {
          from_id: 6,
          action: 2,
          to_id: 2,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'revert',
        },

        {
          from_id: 2,
          action: 3,
          to_id: 6,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'return',
        },

        {
          from_id: 7,
          action: 1,
          to_id: 8,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'progress',
        },

        {
          from_id: 8,
          action: 1,
          to_id: 0,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 1,
          action_type: 'progress',
        },

        {
          from_id: 2,
          action: 1,
          to_id: 7,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 2,
          action_type: 'progress',
        },

        {
          from_id: 7,
          action: 2,
          to_id: 2,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 2,
          action_type: 'revert',
        },

        {
          from_id: 2,
          action: 3,
          to_id: 7,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 2,
          action_type: 'return',
        },
        
        {
          from_id: 2,
          action: 1,
          to_id: 7,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 3,
          action_type: 'progress',
        },

        {
          from_id: 7,
          action: 2,
          to_id: 2,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 3,
          action_type: 'revert',
        },

        {
          from_id: 2,
          action: 3,
          to_id: 7,
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
          form_type_id: 3,
          action_type: 'return',
        },


      ],
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('processes', null, {});
  }
};
