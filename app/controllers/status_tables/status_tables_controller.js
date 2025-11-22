const { Op } = require("sequelize");

const { StatusTables, sequelize } = require("../../models");
const { statusTablesValidator } = require("../status_tables/status_tables_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const StatusTablesController = {
  create: async (req, res) => {
    const matched = statusTablesValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'StatusTables required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const statusTabless = await StatusTables.create({
          status: req.body.status,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({StatusTables: statusTabless, Message: 'StatusTables entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const statusTabless = await StatusTables.findAll({
          attributes: ['id','status'],
        });
        res.status(OK).json({StatusTables: statusTabless});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const statusTabless = await StatusTables.findAll({
          attributes: ['id','status'],
          where: {id: req.params.id},
        });

        res.status(OK).json({StatusTables: statusTabless});
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

        const statusTabless = await StatusTables.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!statusTabless) {
          res.status(NOT_FOUND).json({
            Message: `No matching StatusTables entry with id ${req.params.id}`,
          });
          return;
        }

        await statusTabless.update({
          status: req.body.status,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          StatusTables: statusTabless,
          Message: "StatusTables entry updated.",
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
        const statusTabless = await StatusTables.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!statusTabless) {
          res.status(NOT_FOUND).json({
            Message: `No matching StatusTables entry with id : ${req.params.id}`,
          });

          return;
        }
        await statusTabless.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `StatusTables entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.StatusTablesController = StatusTablesController;
