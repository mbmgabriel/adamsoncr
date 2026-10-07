const { Op } = require("sequelize");

const { SPeerReviewProof, sequelize } = require("../../models");
const { sPeerReviewProofValidator } = require("../s_peer_review_proof/s_peer_review_proof_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const SPeerReviewProofController = {
  create: async (req, res) => {
    const matched = sPeerReviewProofValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'SPeerReviewProof required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const sPeerReviewProofs = await SPeerReviewProof.create({
          name: req.body.name,
          created_by: req.user.id,
          created_at: new Date(Date.now()).toISOString(),
          },
          { transaction: t }
        );
        res.status(CREATED).json({SPeerReviewProof: sPeerReviewProofs, Message: 'SPeerReviewProof entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const sPeerReviewProofs = await SPeerReviewProof.findAll({
          attributes: ['name'],
        });
        res.status(OK).json({SPeerReviewProof: sPeerReviewProofs});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const sPeerReviewProofs = await SPeerReviewProof.findAll({
          attributes: ['name'],
          where: {id: req.params.id},
        });

        res.status(OK).json({SPeerReviewProof: sPeerReviewProofs});
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

        const sPeerReviewProofs = await SPeerReviewProof.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!sPeerReviewProofs) {
          res.status(NOT_FOUND).json({
            Message: `No matching SPeerReviewProof entry with id ${req.params.id}`,
          });
          return;
        }

        await sPeerReviewProofs.update({
          name: req.body.name ? req.body.name : sPeerReviewProofs.name,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          SPeerReviewProof: sPeerReviewProofs,
          Message: "SPeerReviewProof entry updated.",
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
        const sPeerReviewProofs = await SPeerReviewProof.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!sPeerReviewProofs) {
          res.status(NOT_FOUND).json({
            Message: `No matching SPeerReviewProof entry with id : ${req.params.id}`,
          });

          return;
        }
        await sPeerReviewProofs.destroy({
          force: false,
          deleted_by: req.user.id,
          deleted_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Message: `SPeerReviewProof entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.SPeerReviewProofController = SPeerReviewProofController;
