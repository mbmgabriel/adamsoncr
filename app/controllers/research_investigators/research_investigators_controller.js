const { Op } = require("sequelize");

const { ResearchInvestigators, sequelize } = require("../../models");
const { researchInvestigatorsValidator } = require("../research_investigators/research_investigators_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const ResearchInvestigatorsController = {
  create: async (req, res) => {
    const matched = researchInvestigatorsValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'ResearchInvestigators required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const researchInvestigatorss = await ResearchInvestigators.create({
          research_id: req.body.research_id,
          id_number: req.body.id_number,
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          last_name: req.body.last_name,
          mobile_number: req.body.mobile_number,
          email: req.body.email,
          college: req.body.college,
          dept: req.body.dept,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({ResearchInvestigators: researchInvestigatorss, Message: 'ResearchInvestigators entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researchInvestigatorss = await ResearchInvestigators.findAll({
          attributes: ['research_id','id_number','first_name','middle_name','last_name','mobile_number','email','college','dept'],
        });
        res.status(OK).json({ResearchInvestigators: researchInvestigatorss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const researchInvestigatorss = await ResearchInvestigators.findAll({
          attributes: ['research_id','id_number','first_name','middle_name','last_name','mobile_number','email','college','dept'],
          where: {id: req.params.id},
        });

        res.status(OK).json({ResearchInvestigators: researchInvestigatorss});
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

        const researchInvestigatorss = await ResearchInvestigators.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchInvestigatorss) {
          res.status(NOT_FOUND).json({
            Message: `No matching ResearchInvestigators entry with id ${req.params.id}`,
          });
          return;
        }

        await researchInvestigatorss.update({
          research_id: req.body.research_id,
          id_number: req.body.id_number,
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          last_name: req.body.last_name,
          mobile_number: req.body.mobile_number,
          email: req.body.email,
          college: req.body.college,
          dept: req.body.dept,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          ResearchInvestigators: researchInvestigatorss,
          Message: "ResearchInvestigators entry updated.",
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
        const researchInvestigatorss = await ResearchInvestigators.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!researchInvestigatorss) {
          res.status(NOT_FOUND).json({
            Message: `No matching ResearchInvestigators entry with id : ${req.params.id}`,
          });

          return;
        }
        await researchInvestigatorss.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `ResearchInvestigators entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.ResearchInvestigatorsController = ResearchInvestigatorsController;
