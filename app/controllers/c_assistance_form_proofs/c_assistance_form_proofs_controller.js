const { Op } = require("sequelize");

const { CAssistanceFormProofs, sequelize } = require("../../models");
const { cAssistanceFormProofsValidator } = require("../c_assistance_form_proofs/c_assistance_form_proofs_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const CAssistanceFormProofsController = {
  create: async (req, res) => {
    const matched = cAssistanceFormProofsValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'CAssistanceFormProofs required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const cAssistanceFormProofss = await CAssistanceFormProofs.create({
          request_assistance_form_id: req.body.request_assistance_form_id,
          proof_id: req.body.proof_id,
          is_active: req.body.is_active,
          created_by: req.user.id,
          created_at: new Date(Date.now()).toISOString(),
          },
          { transaction: t }
        );
        res.status(CREATED).json({CAssistanceFormProofs: cAssistanceFormProofss, Message: 'CAssistanceFormProofs entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const cAssistanceFormProofss = await CAssistanceFormProofs.findAll({
          attributes: ['request_assistance_form_id','proof_id','is_active'],
        });
        res.status(OK).json({CAssistanceFormProofs: cAssistanceFormProofss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const cAssistanceFormProofss = await CAssistanceFormProofs.findAll({
          attributes: ['request_assistance_form_id','proof_id','is_active'],
          where: {id: req.params.id},
        });

        res.status(OK).json({CAssistanceFormProofs: cAssistanceFormProofss});
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

        const cAssistanceFormProofss = await CAssistanceFormProofs.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!cAssistanceFormProofss) {
          res.status(NOT_FOUND).json({
            Message: `No matching CAssistanceFormProofs entry with id ${req.params.id}`,
          });
          return;
        }

        await cAssistanceFormProofss.update({
          request_assistance_form_id: req.body.request_assistance_form_id ? req.body.request_assistance_form_id : cAssistanceFormProofss.request_assistance_form_id,
          proof_id: req.body.proof_id ? req.body.proof_id : cAssistanceFormProofss.proof_id,
          is_active: req.body.is_active ? req.body.is_active : cAssistanceFormProofss.is_active,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          CAssistanceFormProofs: cAssistanceFormProofss,
          Message: "CAssistanceFormProofs entry updated.",
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
        const cAssistanceFormProofss = await CAssistanceFormProofs.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!cAssistanceFormProofss) {
          res.status(NOT_FOUND).json({
            Message: `No matching CAssistanceFormProofs entry with id : ${req.params.id}`,
          });

          return;
        }
        await cAssistanceFormProofss.destroy({
          force: false,
          deleted_by: req.user.id,
          deleted_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Message: `CAssistanceFormProofs entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.CAssistanceFormProofsController = CAssistanceFormProofsController;
