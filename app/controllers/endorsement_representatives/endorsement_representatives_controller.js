const { Op } = require("sequelize");

const { EndorsementRepresentative, sequelize } = require("../../models");
const { endorsementRepresentativeValidator } = require("../endorsement_representatives/endorsement_representatives_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const EndorsementRepresentativeController = {
  create: async (req, res) => {
    const matched = endorsementRepresentativeValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'EndorsementRepresentative required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const endorsementRepresentatives = await EndorsementRepresentative.create({
          rep_name: req.body.rep_name,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({EndorsementRepresentative: endorsementRepresentatives, Message: 'EndorsementRepresentative entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const endorsementRepresentatives = await EndorsementRepresentative.findAll({
          attributes: ['id','rep_name'],
        });
        res.status(OK).json({EndorsementRepresentative: endorsementRepresentatives});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const endorsementRepresentatives = await EndorsementRepresentative.findAll({
          attributes: ['id','rep_name'],
          where: {id: req.params.id},
        });

        res.status(OK).json({EndorsementRepresentative: endorsementRepresentatives});
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

        const endorsementRepresentatives = await EndorsementRepresentative.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!endorsementRepresentatives) {
          res.status(NOT_FOUND).json({
            Message: `No matching EndorsementRepresentative entry with id ${req.params.id}`,
          });
          return;
        }

        await endorsementRepresentatives.update({
          rep_name: req.body.rep_name,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          EndorsementRepresentative: endorsementRepresentatives,
          Message: "EndorsementRepresentative entry updated.",
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
        const endorsementRepresentatives = await EndorsementRepresentative.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!endorsementRepresentatives) {
          res.status(NOT_FOUND).json({
            Message: `No matching EndorsementRepresentative entry with id : ${req.params.id}`,
          });

          return;
        }
        await endorsementRepresentatives.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `EndorsementRepresentative entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.EndorsementRepresentativeController = EndorsementRepresentativeController;
