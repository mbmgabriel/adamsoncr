'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'departments',
      [
        {
          dept_name: 'College of Architecture',
          dept_initials: 'CoA',
          dept_desc: "College of Architecture",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'College of Business Administration',
          dept_initials: 'CBA',
          dept_desc: "College of Business Administration",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'College of Computing and Information Technology',
          dept_initials: 'CCIT',
          dept_desc: "College of Computing and Information Technology",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'College of Education & Liberal Arts',
          dept_initials: 'CELA',
          dept_desc: "College of Education & Liberal Arts",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'College of Engineering',
          dept_initials: 'CoE',
          dept_desc: "College of Engineering",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'College of Law',
          dept_initials: 'CoL',
          dept_desc: "College of Law",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'College of Nursing',
          dept_initials: 'CoN',
          dept_desc: "College of Nursing",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'College of Pharmacy',
          dept_initials: 'CoP',
          dept_desc: "College of Pharmacy",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'College of Science',
          dept_initials: 'CoS',
          dept_desc: "College of Science",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'Graduate School',
          dept_initials: 'GS',
          dept_desc: "Graduate School",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
        {
          dept_name: 'St. Vincent School of Theology',
          dept_initials: 'SVST',
          dept_desc: "St. Vincent School of Theology",
          created_by: 1,
          created_at: new Date(),
          updated_by: 1,
          updated_at: new Date(),
        },
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null, {});
  }
};
