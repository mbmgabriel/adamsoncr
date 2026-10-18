'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'departments',
      [
        {
          "dept_name": "ADAMSON CENTER FOR EXECUTIVE STUDIES (ACES)",
          "dept_initials": "ACES",
          "dept_desc": "ADAMSON CENTER FOR EXECUTIVE STUDIES (ACES)",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "BASIC EDUCATION DEPARTMENT",
          "dept_initials": "BED",
          "dept_desc": "BASIC EDUCATION DEPARTMENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "BED-GRADE SCHOOL AND JHS (OFFICE)",
          "dept_initials": "BED GS JHS OFFICE",
          "dept_desc": "BASIC EDUCATION DEPARTMENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "BED-GRADE SCHOOL AND JUNIOR HIGH SCHOOL",
          "dept_initials": "BED GS JHS",
          "dept_desc": "BASIC EDUCATION DEPARTMENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "BED-SENIOR HIGH SCHOOL",
          "dept_initials": "BED SHS",
          "dept_desc": "BASIC EDUCATION DEPARTMENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "BED-SENIOR HIGH SCHOOL (OFFICE)",
          "dept_initials": "BED SHS OFFICE",
          "dept_desc": "BASIC EDUCATION DEPARTMENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COLLEGE OF ARCHITECTURE",
          "dept_initials": "COA",
          "dept_desc": "COLLEGE OF ARCHITECTURE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - COLLEGE OF ARCHITECTURE",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ARCHITECTURE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ACCOUNTANCY DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CBA-GRADUATE SCHOOL",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COLLEGE OF BUSINESS ADMINISTRATION",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - COLLEGE OF BUSINESS ADMINISTRATION",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF ACCOUNTANCY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF CUSTOMS AND SUPPLY CHAIN MANAGEMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF FINANCE AND ECONOMICS",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF HOSPITALITY AND TOURISM",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF MARKETING AND OPERATIONS MANAGEMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "FINANCE & ECONOMICS DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "HOSPITALITY MANAGEMENT - GARDEN CAFE",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "HOSPITALITY MANAGEMENT DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "HOSPITALITY MANAGEMENT LABORATORY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF BUSINESS ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CCIT-GRADUATE SCHOOL",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF COMPUTING AND INFORMATION TECHNOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COLLEGE OF COMPUTING AND INFORMATION TECHNOLOGY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF COMPUTING AND INFORMATION TECHNOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COMPUTER SCIENCE DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF COMPUTING AND INFORMATION TECHNOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - CCIT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF COMPUTING AND INFORMATION TECHNOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF COMPUTER SCIENCE",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF COMPUTING AND INFORMATION TECHNOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF INFO. TECHNOLOGY AND INFO. SYSTEM",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF COMPUTING AND INFORMATION TECHNOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "INFORMATION TECHNOLOGY AND INFORMATION SYSTEMS",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF COMPUTING AND INFORMATION TECHNOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CELA-GRADUATE SCHOOL",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COLLEGE OF EDUCATION AND LIBERAL ARTS",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - COLLEGE OF EDUCATION & LIBERAL ART",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF EDUCATION",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF LANGUAGES",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF MEDIA AND COMMUNICATION",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF PHYSICAL EDUCATION",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF POLITICAL AND SOCIAL SCIENCE",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "EDUCATION DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "LANGUAGES DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "PHYSICAL EDUCATION DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF EDUCATION & LIBERAL ARTS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CH.E. LABORATORY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CHEMICAL ENGINEERING DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CIVIL ENGINEERING  DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COE-GRADUATE SCHOOL",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COLLEGE OF ENGINEERING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COMPUTER ENGINEERING DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - COLLEGE OF ENGINEERING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF CHEMICAL ENGINEERING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF CIVIL ENGINEERING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF COMPUTER ENGINEERING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF ELECTRICAL ENGINEERING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF ELECTRONICS ENGINEERING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF INDUSTRIAL AND SYSTEMS ENGINEERING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF MECHANICAL ENGINEERING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF MINING ENGINEERING AND GEOLOGY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ELECTRICAL ENGINEERING DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ELECTRONICS ENGINEERING DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ENGINEERING LAB.",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "GEOLOGY DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "MECHANICAL ENGINEERING DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "MINING ENGINEERING AND GEOLOGY DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "SPACE TECHNOLOGIES AND APPLICATIONS RESEARCH LABOR",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF ENGINEERING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COLLEGE OF LAW",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF LAW",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - COLLEGE OF LAW",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF LAW",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COLLEGE OF NURSING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF NURSING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - COLLEGE OF NURSING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF NURSING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - NURSING",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF NURSING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COLLEGE OF PHARMACY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF PHARMACY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COP - GRADUATE SCHOOL",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF PHARMACY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - COLLEGE OF PHARMACY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF PHARMACY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - PHARM.",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF PHARMACY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "PHARMACY - GRADUATE SCHOOL",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF PHARMACY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "PHARMACY LAB.",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF PHARMACY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "BIOLOGY DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "BIOLOGY LABORATORY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CHEMISTRY DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CHEMISTRY LABORATORY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COLLEGE OF SCIENCE",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "COS-GRADUATE SCHOOL",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - COLLEGE OF SCIENCE",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEAN'S OFFICE - SCIENCE",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF BIOLOGY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF CHEMISTRY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF MATHEMATICS AND PHYSICS",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "DEPARTMENT OF PSYCHOLOGY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "PHYSICS LABORATORY",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "PSYCHOLOGY DEPARTMENT",
          "dept_initials": "-",
          "dept_desc": "COLLEGE OF SCIENCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "INSTITUTE OF RELIGIOUS EDUCATION (IRED)",
          "dept_initials": "-",
          "dept_desc": "INSTITUTE OF RELIGIOUS EDUCATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "LIBRARY SERVICES",
          "dept_initials": "-",
          "dept_desc": "LIBRARY SERVICES",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "LIBRARY SERVICES - READERS SERVICES",
          "dept_initials": "-",
          "dept_desc": "LIBRARY SERVICES",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "LRC-LEARNING RESOURCE COMMONS",
          "dept_initials": "-",
          "dept_desc": "LRC-LEARNING RESOURCE COMMONS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "LRC-READERS SERVICES",
          "dept_initials": "-",
          "dept_desc": "LRC-LEARNING RESOURCE COMMONS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "NATIONAL SERVICE TRAINING - CWTS AND NROTC",
          "dept_initials": "-",
          "dept_desc": "NATIONAL SERVICE TRAINING - CWTS AND NROTC",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CHEMICAL ENGG PROGRAM",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE VP FOR ACADEMIC  AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE FOR VP ACADEMIC AFFAIRS",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE VP FOR ACADEMIC  AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "VPAA OFFICE",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE VP FOR ACADEMIC  AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "REGISTRAR - SCHEDULING AND ENROLLMENT",
          "dept_initials": "-",
          "dept_desc": "REGISTRAR'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "REGISTRAR - STUDENT RECORDS MGT. AND EVALUATION",
          "dept_initials": "-",
          "dept_desc": "REGISTRAR'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "REGISTRAR'S OFFICE",
          "dept_initials": "-",
          "dept_desc": "REGISTRAR'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "SCHEDULING AND AUTOMATION",
          "dept_initials": "-",
          "dept_desc": "REGISTRAR'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "SVST-PASTORAL SERVICES",
          "dept_initials": "-",
          "dept_desc": "SVST-ST. VINCENT SCHOOL OF THEOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "SVST-PHILOSOPHY PROGRAM",
          "dept_initials": "-",
          "dept_desc": "SVST-ST. VINCENT SCHOOL OF THEOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "SVST-ST. VINCENT SCHOOL OF THEOLOGY",
          "dept_initials": "-",
          "dept_desc": "SVST-ST. VINCENT SCHOOL OF THEOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "SVST-STUDENT SERVICES",
          "dept_initials": "-",
          "dept_desc": "SVST-ST. VINCENT SCHOOL OF THEOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "SVST-THEOLOGY PROGRAM",
          "dept_initials": "-",
          "dept_desc": "SVST-ST. VINCENT SCHOOL OF THEOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "SVST-TREASURY",
          "dept_initials": "-",
          "dept_desc": "SVST-ST. VINCENT SCHOOL OF THEOLOGY",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ADMISSION OFFICE",
          "dept_initials": "-",
          "dept_desc": "VPAA OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CENTER FOR INNOVATIVE LEARNING",
          "dept_initials": "-",
          "dept_desc": "VPAA OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CENTER FOR LANGUAGE LEARNING",
          "dept_initials": "-",
          "dept_desc": "VPAA OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CENTER FOR RESEARCH AND DEVELOPMENT (CRD)",
          "dept_initials": "-",
          "dept_desc": "VPAA OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE FOR PROGRAMS AND STANDARDS (OPS)",
          "dept_initials": "-",
          "dept_desc": "VPAA OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE FOR  VP ADMIN.",
          "dept_initials": "-",
          "dept_desc": "ZOFFICE OF THE VICE PRESIDENT FOR ADMINISTRATION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CENTER FOR HEALTH SERVICES",
          "dept_initials": "-",
          "dept_desc": "CENTER FOR HEALTH SERVICES",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CSDO-CAMPUS SECURITY AND SAFETY",
          "dept_initials": "-",
          "dept_desc": "CSDO-CAMPUS SUSTAINABILITY & DEVELOPMENT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CSDO-CAMPUS SUSTAINABILITY & DEVELOPMENT OFFICE",
          "dept_initials": "-",
          "dept_desc": "CSDO-CAMPUS SUSTAINABILITY & DEVELOPMENT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CSDO-HOUSEKEEPING",
          "dept_initials": "-",
          "dept_desc": "CSDO-CAMPUS SUSTAINABILITY & DEVELOPMENT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "FCMO-BLDG. MAINTENANCE & OPERATION (CIVIL WORKS)",
          "dept_initials": "-",
          "dept_desc": "FCMO-FACILITIES AND CONSTRUCTION MGT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "FCMO-BLDG. MAINTENANCE & OPERATION (ELECTRICAL)",
          "dept_initials": "-",
          "dept_desc": "FCMO-FACILITIES AND CONSTRUCTION MGT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "FCMO-BLDG. MAINTENANCE & OPERATION (MECH. WORKS)",
          "dept_initials": "-",
          "dept_desc": "FCMO-FACILITIES AND CONSTRUCTION MGT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "FCMO-FACILITIES & CONSTRUCTION MGT. OFFICE",
          "dept_initials": "-",
          "dept_desc": "FCMO-FACILITIES AND CONSTRUCTION MGT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "HRMDO",
          "dept_initials": "-",
          "dept_desc": "HRMDO",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "HRMDO-PEOPLE AND ORGANIZATIONAL DEVELOPMENT",
          "dept_initials": "-",
          "dept_desc": "HRMDO",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "HRMDO-RECORDS AND INFORMATION MANAGEMENT",
          "dept_initials": "-",
          "dept_desc": "HRMDO",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "HRMDO-RECRUITMENT AND PLACEMENT",
          "dept_initials": "-",
          "dept_desc": "HRMDO",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "HRMDO-SALARIES AND BENEFITS",
          "dept_initials": "-",
          "dept_desc": "HRMDO",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ITC-INFORMATION TECHNOLOGY CENTER",
          "dept_initials": "-",
          "dept_desc": "INFORMATION TECHNOLOGY CENTER",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ITC-NETWORK INFRASTRUCTURE",
          "dept_initials": "-",
          "dept_desc": "INFORMATION TECHNOLOGY CENTER",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ITC-SYSTEMS DEVELOPMENT",
          "dept_initials": "-",
          "dept_desc": "INFORMATION TECHNOLOGY CENTER",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ITC-SYSTEMS MAINTENANCE",
          "dept_initials": "-",
          "dept_desc": "INFORMATION TECHNOLOGY CENTER",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "INSTITUTIONAL DEVELOPMENT AND EXTERNAL AFFAIRS",
          "dept_initials": "-",
          "dept_desc": "INSTITUTIONAL DEVELOPMENT AND EXTERNAL AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "MARKETING AND STUDENT RECRUITMENT OFFICE",
          "dept_initials": "-",
          "dept_desc": "MARKETING AND STUDENT RECRUITMENT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "VPA OFFICE",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE VP  FOR ADMINISTRATIVE AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CASHIER'S OFFICE",
          "dept_initials": "-",
          "dept_desc": "ZOFFICE OF THE VICE PRESIDENT FOR FINANCE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "GENERAL ACCOUNTING",
          "dept_initials": "-",
          "dept_desc": "ACCOUNTING OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ACCOUNTING OFFICE",
          "dept_initials": "-",
          "dept_desc": "CONTROLLER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "BUDGET OFFICE",
          "dept_initials": "-",
          "dept_desc": "CONTROLLER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CONTROLLER'S OFFICE",
          "dept_initials": "-",
          "dept_desc": "CONTROLLER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "STUDENT'S ACCOUNTS",
          "dept_initials": "-",
          "dept_desc": "CONTROLLER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "WAREHOUSE INVENTORY AND CONTROL SECTION",
          "dept_initials": "-",
          "dept_desc": "CONTROLLER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OAS-COL-CANTEEN AND LEASING",
          "dept_initials": "-",
          "dept_desc": "OAS-CANTEEN OPERATIONS AND LEASING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OAS-COL-WATER",
          "dept_initials": "-",
          "dept_desc": "OAS-CANTEEN OPERATIONS AND LEASING",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OAS-US-RISO",
          "dept_initials": "-",
          "dept_desc": "OAS-UNIVERSITY STORE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OAS-US-TOGA",
          "dept_initials": "-",
          "dept_desc": "OAS-UNIVERSITY STORE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OAS-US-UNIVERSITY STORE",
          "dept_initials": "-",
          "dept_desc": "OAS-UNIVERSITY STORE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "TREASURER'S OFFICE",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE VP FOR FINANCIAL AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "VPF OFFICE",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE VP FOR FINANCIAL AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "BUSINESS AFFAIRS OFFICE",
          "dept_initials": "-",
          "dept_desc": "TREASURER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CASH MANAGEMENT OFFICE",
          "dept_initials": "-",
          "dept_desc": "TREASURER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OAS-CANTEEN OPERATIONS AND LEASING",
          "dept_initials": "-",
          "dept_desc": "TREASURER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OAS-UNIVERSITY STORE",
          "dept_initials": "-",
          "dept_desc": "TREASURER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE FOR ALLIED SERVICES (OAS)",
          "dept_initials": "-",
          "dept_desc": "TREASURER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "PURCHASING",
          "dept_initials": "-",
          "dept_desc": "TREASURER'S OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "INVENTORY MANAGEMENT (BAO)",
          "dept_initials": "-",
          "dept_desc": "VPF OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "VPF-INSTITUTIONAL FUND",
          "dept_initials": "-",
          "dept_desc": "VPF OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ADVANCEMENT AND ALUMNI RELATIONS OFFICE (AARO)",
          "dept_initials": "-",
          "dept_desc": "ADVANCEMENT AND ALUMNI RELATIONS OFFICE (AARO)",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "INSTITUTIONAL PLANNING AND POLICY DEVELOPMENT",
          "dept_initials": "-",
          "dept_desc": "INSTITUTIONAL PLANNING AND POLICY DEVELOPMENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "INTERNATIONAL LINKAGES AND RANKING SUPPORT",
          "dept_initials": "-",
          "dept_desc": "INTERNATIONAL LINKAGES AND  RANKING SUPPORT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ITSO-INNOVATION TECHNOLOGY SUPPORT OFFICE",
          "dept_initials": "-",
          "dept_desc": "ITSO-INNOVATION TECHNOLOGY SUPPORT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ITSO-INTELLECTUAL PROPERTY",
          "dept_initials": "-",
          "dept_desc": "ITSO-INNOVATION TECHNOLOGY SUPPORT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ITSO-IP MANAGEMENT AND TECHNOLOGY TRANSFER OFFICE",
          "dept_initials": "-",
          "dept_desc": "ITSO-INNOVATION TECHNOLOGY SUPPORT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ITSO-TECHNOLOGY BUSINESS INCUBATION",
          "dept_initials": "-",
          "dept_desc": "ITSO-INNOVATION TECHNOLOGY SUPPORT OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE FOR INTERNATIONAL RELATIONS",
          "dept_initials": "-",
          "dept_desc": "OFFICE FOR INTERNATIONAL RELATIONS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "STUDENT RECRUITMENT",
          "dept_initials": "-",
          "dept_desc": "OFFICE FOR UNIVERSITY RELATIONS (OUR)",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE FOR VINCENTIAN IDENTITY & MISSION (OVIM)",
          "dept_initials": "-",
          "dept_desc": "OFFICE FOR VINCENTIAN IDENTITY & MISSION",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "ICES",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE PRESIDENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "INTERNAL AUDIT",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE PRESIDENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE OF THE PRESIDENT",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE PRESIDENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "UNIVERSITY INFORMATION SECURITY OFFICE (UISO)",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE PRESIDENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "VINCENTIAN IDENTITY MISSION",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE PRESIDENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE OF THE UNIVERSITY LEGAL COUNSEL",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE UNIVERSITY LEGAL COUNSEL",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "GUIDANCE COUNSELING, TESTING & PLACEMENT SERVICES",
          "dept_initials": "-",
          "dept_desc": "GUIDANCE COUNSELING, TESTING & PLACEMENT SERVICES",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "GUIDANCE, COUNSELING, TESTING & PLACEMENT- BED",
          "dept_initials": "-",
          "dept_desc": "GUIDANCE COUNSELING, TESTING & PLACEMENT SERVICES",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "GUIDANCE-CAREER AND PLACEMENT",
          "dept_initials": "-",
          "dept_desc": "GUIDANCE COUNSELING, TESTING & PLACEMENT SERVICES",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "PLACEMENT",
          "dept_initials": "-",
          "dept_desc": "GUIDANCE COUNSELING, TESTING & PLACEMENT SERVICES",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "TESTING AND RESEARCH",
          "dept_initials": "-",
          "dept_desc": "GUIDANCE COUNSELING, TESTING & PLACEMENT SERVICES",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "INTEGRATED COMMUNITY EXTENSION SERVICES (ICES)",
          "dept_initials": "-",
          "dept_desc": "INTEGRATED COMMUNITY EXTENSION SERVICES (ICES)",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OAD-ATHLETES' ELIGIBILITY AND INTERNAL OPERATIONS",
          "dept_initials": "-",
          "dept_desc": "OAD-OFFICE FOR ATHLETIC DEVELOPMENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OAD-OFFICE FOR ATHLETIC DEVELOPMENT",
          "dept_initials": "-",
          "dept_desc": "OAD-OFFICE FOR ATHLETIC DEVELOPMENT",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE FOR SECURITY AND SAFETY (OSS)",
          "dept_initials": "-",
          "dept_desc": "OFFICE FOR STUDENT AFFAIRS (OSA)",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "STUDENT DISCIPLINE",
          "dept_initials": "-",
          "dept_desc": "OFFICE FOR STUDENT AFFAIRS (OSA)",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CAMPUS MINISTRY",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE VP FOR STUDENT AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CWTS",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE VP FOR STUDENT AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "VPSA OFFICE",
          "dept_initials": "-",
          "dept_desc": "OFFICE OF THE VP FOR STUDENT AFFAIRS",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OSL-OFFICE FOR STUDENT LIFE",
          "dept_initials": "-",
          "dept_desc": "OSL-OFFICE FOR STUDENT LIFE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OSL-STUDENT ENGAGEMENT AND DEVELOPMENT",
          "dept_initials": "-",
          "dept_desc": "OSL-OFFICE FOR STUDENT LIFE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OSL-STUDENT FORMATION AND ACCOUNTABILITY",
          "dept_initials": "-",
          "dept_desc": "OSL-OFFICE FOR STUDENT LIFE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "CULTURAL AFFAIRS OFFICE",
          "dept_initials": "-",
          "dept_desc": "VPSA OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        },
        {
          "dept_name": "OFFICE FOR STUDENT ASSISTANCE & SCHOLARSHIP (OSAS)",
          "dept_initials": "-",
          "dept_desc": "VPSA OFFICE",
          "created_by": 1,
          "created_at": new Date(),
          "updated_by": 1,
          "updated_at": new Date()
        }
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null, {});
  }
};
