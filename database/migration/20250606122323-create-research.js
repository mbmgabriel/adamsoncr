'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('research', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.TEXT
      },
      category: {
        type: Sequelize.STRING
      },
      purpose_id: {
        type: Sequelize.INTEGER
      },
      version_number: {
        type: Sequelize.STRING
      },
      research_duration: {
        type: Sequelize.STRING
      },
      ethical_considerations: {
        type: Sequelize.INTEGER
      },
      submitted_by: {
        type: Sequelize.STRING
      },
      submitted_date: {
        type: Sequelize.DATE
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_by: {
        type: Sequelize.INTEGER
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      deleted_by: {
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('research');
  }
};