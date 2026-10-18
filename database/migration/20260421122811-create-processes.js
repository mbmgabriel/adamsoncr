'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('processes', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER
      // },
      from_id: {
        type: Sequelize.INTEGER
      },
      to_id: {
        type: Sequelize.INTEGER
      },
      action: {
        type: Sequelize.INTEGER
      },
      form_type_id: {
        type: Sequelize.INTEGER
      },
      action_type : {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('processes');
  }
};