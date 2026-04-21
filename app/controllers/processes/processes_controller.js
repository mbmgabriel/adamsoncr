const { Op } = require("sequelize");

const { Processes, UserRole, sequelize } = require("../../models");
const { processesValidator } = require("../processes/processes_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const ProcessesController = {
  create: async (req, res) => {
    const matched = processesValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'Processes required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const processess = await Processes.create({
          from_id: req.body.from_id,
          action: req.body.action,
          to_id: req.body.to_id,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({Processes: processess, Message: 'Processes entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const processess = await Processes.findAll({
          attributes: ['from_id','action','to_id'],
          include: [
            {
              model: UserRole,
              as: 'From',
              attributes: ['role_name']
            },
            {
              model: UserRole,
              as: 'To',
              attributes: ['role_name']
            },
          ]
        });
        res.status(OK).json({Processes: processess});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const processess = await Processes.findAll({
          attributes: ['from_id','action','to_id'],
          where: {id: req.params.id},
          include: [
            {
              model: UserRole,
              as: 'From',
              attributes: ['role_name']
            },
            {
              model: UserRole,
              as: 'To',
              attributes: ['role_name']
            },
          ]
        });

        res.status(OK).json({Processes: processess});
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

        const processess = await Processes.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!processess) {
          res.status(NOT_FOUND).json({
            Message: `No matching Processes entry with id ${req.params.id}`,
          });
          return;
        }

        await processess.update({
          from_id: req.body.from_id,
          action: req.body.action,
          to_id: req.body.to_id,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Processes: processess,
          Message: "Processes entry updated.",
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
        const processess = await Processes.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!processess) {
          res.status(NOT_FOUND).json({
            Message: `No matching Processes entry with id : ${req.params.id}`,
          });

          return;
        }
        await processess.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `Processes entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.ProcessesController = ProcessesController;
