'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incentive_forms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name_of_authors: {
        type: Sequelize.STRING
      },
      email_address: {
        type: Sequelize.STRING
      },
      contact_number: {
        type: Sequelize.STRING
      },
      incentive_type_id: {
        type: Sequelize.INTEGER
      },
      submission_date: {
        type: Sequelize.DATE
      },
      publisher_info: {
        type: Sequelize.STRING
      },
      title_of_work: {
        type: Sequelize.STRING
      },
      publication_date: {
        type: Sequelize.DATE
      },
      citation_date: {
        type: Sequelize.DATE
      },
      citation_no: {
        type: Sequelize.INTEGER
      },
      isbn: {
        type: Sequelize.STRING
      },
      peer_review_proof_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('incentive_forms');
  }
};