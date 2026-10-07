const { Op } = require("sequelize");

const { RequestAssistanceForms, sequelize } = require("../../models");
const { requestAssistanceFormsValidator } = require("../request_assistance_forms/request_assistance_forms_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const RequestAssistanceFormsController = {
  create: async (req, res) => {
    const matched = requestAssistanceFormsValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'RequestAssistanceForms required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const requestAssistanceFormss = await RequestAssistanceForms.create({
          name_of_presenter: req.body.name_of_presenter,
          email_address: req.body.email_address,
          contact_number: req.body.contact_number,
          conference_title: req.body.conference_title,
          research_paper_title: req.body.research_paper_title,
          conference_link: req.body.conference_link,
          acceptance_date: req.body.acceptance_date,
          conference_date: req.body.conference_date,
          created_by: req.user.id,
          created_at: new Date(Date.now()).toISOString(),
          },
          { transaction: t }
        );
        res.status(CREATED).json({RequestAssistanceForms: requestAssistanceFormss, Message: 'RequestAssistanceForms entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const requestAssistanceFormss = await RequestAssistanceForms.findAll({
          attributes: ['name_of_presenter','email_address','contact_number','conference_title','research_paper_title','conference_link','acceptance_date','conference_date',['created_by', 'user_account_id']],
          include: [
            {
              model: sequelize.models.CAssistanceFormProofs,
              attributes: ['proof_id'],
              include: [
                {
                  model: sequelize.models.SAssistanceFormProofs,
                  attributes: ['name'],
                },
              ],
            },
          ],
        });
        res.status(OK).json({RequestAssistanceForms: requestAssistanceFormss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const requestAssistanceFormss = await RequestAssistanceForms.findAll({
          attributes: ['name_of_presenter','email_address','contact_number','conference_title','research_paper_title','conference_link','acceptance_date','conference_date',['created_by', 'user_account_id']],
          where: {id: req.params.id},
          include: [
            {
              model: sequelize.models.CAssistanceFormProofs,
              attributes: ['proof_id'],
              include: [
                {
                  model: sequelize.models.SAssistanceFormProofs,
                  attributes: ['name'],
                },
              ],
            },
          ],
        });

        res.status(OK).json({RequestAssistanceForms: requestAssistanceFormss});
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

  getByUserId: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const requestAssistanceFormss = await RequestAssistanceForms.findAll({
          attributes: ['name_of_presenter','email_address','contact_number','conference_title','research_paper_title','conference_link','acceptance_date','conference_date',['created_by', 'user_account_id']],
          where: {created_by: req.user.id},
          include: [
            {
              model: sequelize.models.CAssistanceFormProofs,
              attributes: ['proof_id'],
              include: [
                {
                  model: sequelize.models.SAssistanceFormProofs,
                  attributes: ['name'],
                },
              ],
            },
          ],
        });

        // requestAssistanceFormsValidator.CAssistanceFormProofs

        res.status(OK).json({RequestAssistanceForms: requestAssistanceFormss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  update: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {

        const requestAssistanceFormss = await RequestAssistanceForms.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!requestAssistanceFormss) {
          res.status(NOT_FOUND).json({
            Message: `No matching RequestAssistanceForms entry with id ${req.params.id}`,
          });
          return;
        }

        await requestAssistanceFormss.update({
          name_of_presenter: req.body.name_of_presenter ? req.body.name_of_presenter : requestAssistanceFormss.name_of_presenter,
          email_address: req.body.email_address ? req.body.email_address : requestAssistanceFormss.email_address,
          contact_number: req.body.contact_number ? req.body.contact_number : requestAssistanceFormss.contact_number,
          conference_title: req.body.conference_title ? req.body.conference_title : requestAssistanceFormss.conference_title,
          research_paper_title: req.body.research_paper_title ? req.body.research_paper_title : requestAssistanceFormss.research_paper_title,
          conference_link: req.body.conference_link ? req.body.conference_link : requestAssistanceFormss.conference_link,
          acceptance_date: req.body.acceptance_date ? req.body.acceptance_date : requestAssistanceFormss.acceptance_date,
          conference_date: req.body.conference_date ? req.body.conference_date : requestAssistanceFormss.conference_date,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          RequestAssistanceForms: requestAssistanceFormss,
          Message: "RequestAssistanceForms entry updated.",
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
        const requestAssistanceFormss = await RequestAssistanceForms.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!requestAssistanceFormss) {
          res.status(NOT_FOUND).json({
            Message: `No matching RequestAssistanceForms entry with id : ${req.params.id}`,
          });

          return;
        }
        await requestAssistanceFormss.destroy({
          force: false,
          deleted_by: req.user.id,
          deleted_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Message: `RequestAssistanceForms entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.RequestAssistanceFormsController = RequestAssistanceFormsController;
