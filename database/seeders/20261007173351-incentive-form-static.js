'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      's_incentive_types',
      [
        {
          name: 'Publication Incentive',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'Citation Incentive',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'H-index incentive',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
      ]
    )

    await queryInterface.bulkInsert(
      's_peer_review_proofs',
      [
        {
          name: 'Evaluation of Peer Reviewers',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'Communication with Editor',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'Corrections Made',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
      ]
    )

    await queryInterface.bulkInsert(
      's_attachment_infos',
      [
        {
          name: 'Internet Link /Hyperlink (for online access)',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'Link to Google Scholar Account',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'Electronic Copy (for soft copy submission)',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
        {
          name: 'Photocopy of Article /Book (for hard copy submission)',
          created_at: new Date(),
          created_by: 1,
          updated_at: new Date(),
          updated_by: 1,
        },
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('s_incentive_types', null, {});
    await queryInterface.bulkDelete('s_peer_review_proofs', null, {});
    await queryInterface.bulkDelete('s_attachment_infos', null, {});
  }
};
