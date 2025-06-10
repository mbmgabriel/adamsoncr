const { Op } = require("sequelize");


const { Research, sequelize } = require("../../models");
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');
const { researchValidator } = require("../research/research_validator")


const ResearchController = {
  create: async (req, res) => {
    const matched = researchValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'Role Name required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const researchs = await Research.create({
          title: req.body.title,
          category: req.body.category,
          purpose_id: req.body.purpose_id,
          version_number: req.body.version_number,
          research_duration: req.body.research_duration,
          ethical_considerations: req.body.ethical_considerations,
          submitted_by: req.body.submitted_by,
          submitted_date: req.body.submitted_date,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({Research: researchs, Message: 'Research entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },
  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researches = await Research.findAll({
          attributes: ['title','category','purpose_id','version_number','research_duration','ethical_considerations','submitted_by','submitted_date'],
        });
        res.status(OK).json(researches);
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },
  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const research = await Research.findAll({
          attributes: ['title','category','purpose_id','version_number','research_duration','ethical_considerations','submitted_by','submitted_date'],
          where: {id: req.params.id},
        });

        res.status(OK).json(research);
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

        const researchs = await Research.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchs) {
          res.status(NOT_FOUND).json({
            Message: `No matching User Role with id ${req.params.id}`,
          });
          return;
        }

        await researchs.update({
          title: req.body.title || researchs.title,
          category: req.body.category || researchs.category,
          purpose_id: req.body.purpose_id || researchs.purpose_id,
          version_number: req.body.version_number || researchs.version_number,
          research_duration: req.body.research_duration || researchs.research_duration,
          ethical_considerations: req.body.ethical_considerations || researchs.ethical_considerations,
          submitted_by: req.body.submitted_by || researchs.submitted_by,
          submitted_date: req.body.submitted_date || researchs.submitted_date,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Research: researchs,
          Message: "Research entry updated.",
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
        const researchs = await Research.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchs) {
          res.status(NOT_FOUND).json({
            Message: `No matching Research entry with id : ${req.params.id}`,
          });

          return;
        }
        await researchs.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `Research entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

};

module.exports.ResearchController = ResearchController;
