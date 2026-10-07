const { Op } = require("sequelize");

const { SAssistanceFormProofs, sequelize } = require("../../models");
const { sAssistanceFormProofsValidator } = require("../s_assistance_form_proofs/s_assistance_form_proofs_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const SAssistanceFormProofsController = {
  create: async (req, res) => {
    const matched = sAssistanceFormProofsValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'SAssistanceFormProofs required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const sAssistanceFormProofss = await SAssistanceFormProofs.create({
          name: req.body.name,
          created_by: req.user.id,
          created_at: new Date(Date.now()).toISOString(),
          },
          { transaction: t }
        );
        res.status(CREATED).json({SAssistanceFormProofs: sAssistanceFormProofss, Message: 'SAssistanceFormProofs entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const sAssistanceFormProofss = await SAssistanceFormProofs.findAll({
          attributes: ['name'],
        });
        res.status(OK).json({SAssistanceFormProofs: sAssistanceFormProofss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const sAssistanceFormProofss = await SAssistanceFormProofs.findAll({
          attributes: ['name'],
          where: {id: req.params.id},
        });

        res.status(OK).json({SAssistanceFormProofs: sAssistanceFormProofss});
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

        const sAssistanceFormProofss = await SAssistanceFormProofs.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!sAssistanceFormProofss) {
          res.status(NOT_FOUND).json({
            Message: `No matching SAssistanceFormProofs entry with id ${req.params.id}`,
          });
          return;
        }

        await sAssistanceFormProofss.update({
          name: req.body.name ? req.body.name : sAssistanceFormProofss.name,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          SAssistanceFormProofs: sAssistanceFormProofss,
          Message: "SAssistanceFormProofs entry updated.",
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
        const sAssistanceFormProofss = await SAssistanceFormProofs.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!sAssistanceFormProofss) {
          res.status(NOT_FOUND).json({
            Message: `No matching SAssistanceFormProofs entry with id : ${req.params.id}`,
          });

          return;
        }
        await sAssistanceFormProofss.destroy({
          force: false,
          deleted_by: req.user.id,
          deleted_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Message: `SAssistanceFormProofs entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.SAssistanceFormProofsController = SAssistanceFormProofsController;
