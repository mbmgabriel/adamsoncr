'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request_assistance_forms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name_of_presenter: {
        type: Sequelize.STRING
      },
      email_address: {
        type: Sequelize.STRING
      },
      contact_number: {
        type: Sequelize.STRING
      },
      conference_title: {
        type: Sequelize.STRING
      },
      research_paper_title: {
        type: Sequelize.STRING
      },
      conference_link: {
        type: Sequelize.STRING
      },
      acceptance_date: {
        type: Sequelize.DATE
      },
      conference_date: {
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
    await queryInterface.dropTable('request_assistance_forms');
  }
};