const { Op } = require("sequelize");

const { ResearchPurpose, sequelize } = require("../../models");
const { researchPurposesValidator } = require("../research_purposes/research_purposes_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const ResearchPurposeController = {
  create: async (req, res) => {
    const matched = researchPurposesValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'Research Name required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const ResearchPurposes = await ResearchPurpose.create({
          purpose_name: req.body.purpose_name,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({ResearchPurpose: ResearchPurposes, Message: 'ResearchPurpose entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researchPurposes = await ResearchPurpose.findAll({
          attributes: ['purpose_name'],
        });
        res.status(OK).json({ResearchPurpose: researchPurposes});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const ResearchPurposes = await ResearchPurpose.findAll({
          attributes: ['purpose_name'],
          where: {id: req.params.id},
        });

        res.status(OK).json({ResearchPurpose: ResearchPurposes});
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

        const ResearchPurposes = await ResearchPurpose.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!ResearchPurposes) {
          res.status(NOT_FOUND).json({
            Message: `No matching ResearchPurpose entry with id ${req.params.id}`,
          });
          return;
        }

        await ResearchPurposes.update({
          purpose_name: req.body.purpose_name,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          ResearchPurpose: ResearchPurposes,
          Message: "ResearchPurpose entry updated.",
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
        const ResearchPurposes = await ResearchPurpose.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!ResearchPurposes) {
          res.status(NOT_FOUND).json({
            Message: `No matching ResearchPurpose entry with id : ${req.params.id}`,
          });

          return;
        }
        await ResearchPurposes.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `ResearchPurpose entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.ResearchPurposeController = ResearchPurposeController;
