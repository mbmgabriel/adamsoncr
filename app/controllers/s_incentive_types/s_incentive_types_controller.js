const { Op } = require("sequelize");

const { SIncentiveTypes, sequelize } = require("../../models");
const { sIncentiveTypesValidator } = require("../s_incentive_types/s_incentive_types_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const SIncentiveTypesController = {
  create: async (req, res) => {
    const matched = sIncentiveTypesValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'SIncentiveTypes required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const sIncentiveTypess = await SIncentiveTypes.create({
          name: req.body.name,
          created_by: req.user.id,
          created_at: new Date(Date.now()).toISOString(),
          },
          { transaction: t }
        );
        res.status(CREATED).json({SIncentiveTypes: sIncentiveTypess, Message: 'SIncentiveTypes entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const sIncentiveTypess = await SIncentiveTypes.findAll({
          attributes: ['name'],
        });
        res.status(OK).json({SIncentiveTypes: sIncentiveTypess});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const sIncentiveTypess = await SIncentiveTypes.findAll({
          attributes: ['name'],
          where: {id: req.params.id},
        });

        res.status(OK).json({SIncentiveTypes: sIncentiveTypess});
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

        const sIncentiveTypess = await SIncentiveTypes.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!sIncentiveTypess) {
          res.status(NOT_FOUND).json({
            Message: `No matching SIncentiveTypes entry with id ${req.params.id}`,
          });
          return;
        }

        await sIncentiveTypess.update({
          name: req.body.name ? req.body.name : sIncentiveTypess.name,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          SIncentiveTypes: sIncentiveTypess,
          Message: "SIncentiveTypes entry updated.",
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
        const sIncentiveTypess = await SIncentiveTypes.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!sIncentiveTypess) {
          res.status(NOT_FOUND).json({
            Message: `No matching SIncentiveTypes entry with id : ${req.params.id}`,
          });

          return;
        }
        await sIncentiveTypess.destroy({
          force: false,
          deleted_by: req.user.id,
          deleted_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Message: `SIncentiveTypes entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.SIncentiveTypesController = SIncentiveTypesController;
