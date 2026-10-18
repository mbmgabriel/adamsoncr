const { Op } = require("sequelize");

const { FormTypes, sequelize } = require("../../models");
const { formTypesValidator } = require("../form_types/form_types_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const FormTypesController = {
  create: async (req, res) => {
    const matched = formTypesValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'FormTypes required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const formTypess = await FormTypes.create({
          form_type: req.body.form_type,
          description: req.body.description,
          created_by: req.user.id,
          created_at: new Date(Date.now()).toISOString(),
          },
          { transaction: t }
        );
        res.status(CREATED).json({FormTypes: formTypess, Message: 'FormTypes entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const formTypess = await FormTypes.findAll({
          attributes: ['id','form_type','description'],
        });
        res.status(OK).json({FormTypes: formTypess});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const formTypess = await FormTypes.findAll({
          attributes: ['id','form_type','description'],
          where: {id: req.params.id},
        });

        res.status(OK).json({FormTypes: formTypess});
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

        const formTypess = await FormTypes.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!formTypess) {
          res.status(NOT_FOUND).json({
            Message: `No matching FormTypes entry with id ${req.params.id}`,
          });
          return;
        }

        await formTypess.update({
          form_type: req.body.form_type ? req.body.form_type : formTypess.form_type,
          description: req.body.description ? req.body.description : formTypess.description,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          FormTypes: formTypess,
          Message: "FormTypes entry updated.",
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
        const formTypess = await FormTypes.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!formTypess) {
          res.status(NOT_FOUND).json({
            Message: `No matching FormTypes entry with id : ${req.params.id}`,
          });

          return;
        }
        await formTypess.destroy({
          force: false,
          deleted_by: req.user.id,
          deleted_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Message: `FormTypes entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.FormTypesController = FormTypesController;
