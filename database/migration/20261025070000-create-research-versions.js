'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('research_versions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      research_id: { type: Sequelize.INTEGER, allowNull: false },
      version_number: { type: Sequelize.STRING, allowNull: false },
      snapshot: { type: Sequelize.TEXT('long'), allowNull: false },
      created_by: Sequelize.INTEGER,
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: Sequelize.DATE,
    });
    await queryInterface.addIndex('research_versions', ['research_id']);
  },
  async down(queryInterface) { await queryInterface.dropTable('research_versions'); },
};
