const { Op } = require("sequelize");

const { Departments, sequelize } = require("../../models");
const { departmentsValidator } = require("../departments/departments_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const DepartmentsController = {
  create: async (req, res) => {
    const matched = departmentsValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'Departments required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const departmentss = await Departments.create({
          dept_name: req.body.dept_name,
          dept_initials: req.body.dept_initials,
          dept_desc: req.body.dept_desc,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({Departments: departmentss, Message: 'Departments entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const departmentss = await Departments.findAll({
          attributes: ['dept_name','dept_initials','dept_desc'],
        });
        res.status(OK).json({Departments: departmentss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const departmentss = await Departments.findAll({
          attributes: ['dept_name','dept_initials','dept_desc'],
          where: {id: req.params.id},
        });

        res.status(OK).json({Departments: departmentss});
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

  update: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {

        const departmentss = await Departments.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!departmentss) {
          res.status(NOT_FOUND).json({
            Message: `No matching Departments entry with id ${req.params.id}`,
          });
          return;
        }

        await departmentss.update({
          dept_name: req.body.dept_name,
          dept_initials: req.body.dept_initials,
          dept_desc: req.body.dept_desc,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Departments: departmentss,
          Message: "Departments entry updated.",
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

  delete: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const departmentss = await Departments.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!departmentss) {
          res.status(NOT_FOUND).json({
            Message: `No matching Departments entry with id : ${req.params.id}`,
          });

          return;
        }
        await departmentss.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `Departments entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.DepartmentsController = DepartmentsController;
