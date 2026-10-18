const { Op } = require("sequelize");

const { RequestAssistanceForms, sequelize, CAssistanceFormProofs, Endorsements, User, UserAccount, UserRole } = require("../../models");
const { requestAssistanceFormsValidator } = require("../request_assistance_forms/request_assistance_forms_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const RequestAssistanceFormsController = {
  create: async (req, res) => {
    const matched = requestAssistanceFormsValidator(req.body, res).validate()

    if (!matched) {
      res.status(PRECONDITION_FAILED).json({ message: 'RequestAssistanceForms required' });
    }

    const approvingBodies = await User.findAll({
      attributes: ['id'],
      include: [
        {
          model: UserAccount, attributes: ['role_id'], where: { role_id: 7 },
          include: [{ model: UserRole, attributes: ['role_desc'] },]
        },
      ]
    });

    const endorsements = approvingBodies?.map(e => ({
      form_type_id: 2,
      endorsement_rep_id: e.id,
      status_id: 4,
    }));

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
          CAssistanceFormProofs: req.body.CAssistanceFormProofs,
          Endorsements: endorsements,
        },
          {
            include: [CAssistanceFormProofs, Endorsements],
          },
          { transaction: t }
        );
        res.status(CREATED).json({ RequestAssistanceForms: requestAssistanceFormss, Message: 'RequestAssistanceForms entry created.' });
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {

        const role_id = req.user.role_id;
        if (role_id === 7) {

          const endorsements = await Endorsements.findAll({
            attributes: ['research_id'],
            where: { endorsement_rep_id: req.user.id, form_type_id: 2 },
          });

          const research_ids = endorsements.map(ce => ce.research_id)

          const checkEndorsements = await Endorsements.findAll({
            where: { research_id: research_ids, form_type_id: 2 },
            include: [
              {
                model: User,
                attributes: ['id',],
                include: [
                  {
                    model: UserAccount,
                    attributes: ['role_id'],
                  }
                ]
              }
            ]
          });

          const role_status = checkEndorsements.map(ce => ({
            role_id: ce.User.UserAccount.role_id,
            research_id: ce.research_id,
            status_id: ce.status_id,
          }))

          let display_research_ids = []

          research_ids.forEach(element => {
            let crdDirectorApproved = role_status.find(rs => rs.role_id === 7 && element === rs.research_id)?.status_id === 6

            if (role_id === 7 && crdDirectorApproved) {
              display_research_ids.push(element)
            }
          });

          const requestAssistanceFormss = await RequestAssistanceForms.findAll({
            attributes: ['id', 'name_of_presenter', 'email_address', 'contact_number', 'conference_title', 'research_paper_title', 'conference_link', 'acceptance_date', 'conference_date', ['created_by', 'user_account_id']],
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
              {
                model: sequelize.models.Endorsements,
                attributes: ['endorsement_rep_id'],
              }
            ],
            where: { id: display_research_ids },
          });
          res.status(OK).json({ RequestAssistanceForms: requestAssistanceFormss });
          return;
        }

        const requestAssistanceFormss = await RequestAssistanceForms.findAll({
          attributes: ['id', 'name_of_presenter', 'email_address', 'contact_number', 'conference_title', 'research_paper_title', 'conference_link', 'acceptance_date', 'conference_date', ['created_by', 'user_account_id']],
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
        res.status(OK).json({ RequestAssistanceForms: requestAssistanceFormss });
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
          attributes: ['id', 'name_of_presenter', 'email_address', 'contact_number', 'conference_title', 'research_paper_title', 'conference_link', 'acceptance_date', 'conference_date', ['created_by', 'user_account_id']],
          where: { id: req.params.id },
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

        res.status(OK).json({ RequestAssistanceForms: requestAssistanceFormss });
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
          attributes: ['id', 'name_of_presenter', 'email_address', 'contact_number', 'conference_title', 'research_paper_title', 'conference_link', 'acceptance_date', 'conference_date', ['created_by', 'user_account_id']],
          where: { created_by: req.user.id },
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

        res.status(OK).json({ RequestAssistanceForms: requestAssistanceFormss });
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
          RequestAssistanceFormProofs: req.body.CAssistanceFormProofs ? req.body.CAssistanceFormProofs : requestAssistanceFormss.RequestAssistanceFormProofs,
          // Endorsements: req.body.Endorsements ? req.body.Endorsements : requestAssistanceFormss.Endorsements,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        },
          { include: [CAssistanceFormProofs] }
        );

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
