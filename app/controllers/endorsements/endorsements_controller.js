const { Op, where } = require("sequelize");

const { Endorsements, User, UserAccount, UserRole, StatusTables, FormTypes, sequelize, Research, RequestAssistanceForms, IncentiveForms } = require("../../models");
const { endorsementsValidator } = require("../endorsements/endorsements_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const EndorsementsController = {
  create: async (req, res) => {
    if (Number(req.body.form_type_id) === 1) return res.status(403).json({ message: 'Research reviewers are managed by the research workflow.' });
    const matched = endorsementsValidator(req.body, res).validate()

    if (!matched) {
      res.status(PRECONDITION_FAILED).json({ message: 'Endorsements required' });
    }

    await sequelize.transaction(async (t) => {
      try {
        const endorsementss = await Endorsements.create({
          research_id: req.body.research_id,
          endorsement_rep_id: req.body.endorsement_rep_id,
          // endorsement_rep_name: req.body.endorsement_rep_name,
          // status: req.body.status,
          status_id: req.body.status_id,
          // status: req.body.status,
          remarks: req.body.remarks,
          created_at: req.user.id,
          form_type_id: req.body.form_type_id,
        },
          { transaction: t }
        );
        res.status(CREATED).json({ Endorsements: endorsementss, Message: 'Endorsements entry created.' });
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const endorsementss = await Endorsements.findAll({
          attributes: ['research_id', 'endorsement_rep_id',
            // 'endorsement_rep_name',
            // 'status',
            'status_id',
            'remarks',
            'id', 'created_at', 'updated_at',
            'form_type_id'
          ],
          include: [
            {
              model: User,
              attributes: ['first_name', 'middle_name', 'last_name', 'dept_id'],
              include: [
                {
                  model: UserAccount,
                  attributes: ['role_id'],
                  include: { model: UserRole, attributes: ['role_desc'] }
                },
              ]
            },
            {
              model: StatusTables,
              attributes: ['status']
            },
            {
              model: FormTypes,
              attributes: ['form_type']
            }
          ]
        });
        res.status(OK).json({ Endorsements: endorsementss });
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  getByResearchId: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const endorsementss = await Endorsements.findAll({
          attributes: ['research_id', 'endorsement_rep_id',
            // 'endorsement_rep_name',
            // 'status',
            'status_id',
            'remarks',
            'id', 'created_at', 'updated_at',
            'form_type_id'
          ],
          include: [
            {
              model: User,
              attributes: ['first_name', 'middle_name', 'last_name', 'dept_id'],
              include: [
                {
                  model: UserAccount,
                  attributes: ['role_id'],
                  include: { model: UserRole, attributes: ['role_desc'] }
                },
              ],
            },
            {
              model: StatusTables,
              attributes: ['status']
            },
            {
              model: FormTypes,
              attributes: ['form_type']
            }
          ],
          where: { research_id: req.params.research_id },
        });

        res.status(OK).json({ Endorsements: endorsementss });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  // where: {id: req.params.id},


  getByResearchIdFormType: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const endorsementss = await Endorsements.findAll({
          attributes: ['research_id', 'endorsement_rep_id',
            // 'endorsement_rep_name',
            // 'status',
            'status_id',
            'remarks',
            'id', 'created_at', 'updated_at',
            'form_type_id'
          ],
          include: [
            {
              model: User,
              attributes: ['first_name', 'middle_name', 'last_name', 'dept_id'],
              include: [
                {
                  model: UserAccount,
                  attributes: ['role_id'],
                  include: { model: UserRole, attributes: ['role_desc'] }
                },
              ],
            },
            {
              model: StatusTables,
              attributes: ['status']
            },
            {
              model: FormTypes,
              attributes: ['form_type']
            }
          ],
          where: { research_id: req.params.research_id, form_type_id: req.params.form_type_id },
        });
        res.status(OK).json({ Endorsements: endorsementss });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },



  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const endorsementss = await Endorsements.findAll({
          attributes: ['research_id', 'endorsement_rep_id',
            // 'endorsement_rep_name',
            // 'status',
            'status_id',
            'remarks',
            'id', 'created_at', 'updated_at',
            'form_type_id'
          ],
          include: [
            {
              model: User,
              attributes: ['first_name', 'middle_name', 'last_name', 'dept_id'],
              include: [
                {
                  model: UserAccount,
                  attributes: ['role_id'],
                  include: { model: UserRole, attributes: ['role_desc'] }
                }
              ]
            },
            {
              model: FormTypes,
              attributes: ['form_type']
            }
          ],
          where: { id: req.params.id },
        });

        res.status(OK).json({ Endorsements: endorsementss });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

  updateByResearchUser: async (req, res) => {
    if (Number(req.params.form_type_id) === 1) {
      return require('../research/research_workflow_controller').ResearchWorkflowController.review(req, res);
    }
    await sequelize.transaction(async (t) => {
      try {

        function canBeInteger(val) {
          // Trim strings to handle whitespace cleanly
          const cleaned = typeof val === 'string' ? val.trim() : val;
          return Number.isInteger(Number(cleaned));
        }

        const formTypeId = canBeInteger(req.params.form_type_id) ? req.params.form_type_id : 1;

        const endorsementss = await Endorsements.findOne(
          {
            where: {
              research_id: req.params.research_id,
              // endorsement_rep_id: req.params.user_account_id
              endorsement_rep_id: req.user.id,
              form_type_id: formTypeId
            },
          },
        );

        if (!endorsementss) {
          res.status(NOT_FOUND).json({
            Message: `No matching Endorsements entry with Research id ${req.params.research_id}`,
          });
          return;
        }

        await endorsementss.update({
          // research_id: req.body.research_id,
          // endorsement_rep_id: req.body.endorsement_rep_id,
          // endorsement_rep_name: req.body.endorsement_rep_name,
          // status: req.body.status,
          status_id: req.body.status_id,
          remarks: req.body.remarks,
          form_type_id: req.body.form_type_id,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        if (req.params.form_type_id == 2) { // Request and Incentive Forms
          const form = await RequestAssistanceForms.findOne(
            {
              where: {
                id: req.params.research_id,
              },
            },
          );

          if (!form) {
            res.status(NOT_FOUND).json({
              Message: `No matching Research with id ${req.params.id}`,
            });
            return;
          }

          await form.update({
            status_id: req.body.status_id,
            updated_by: req.user.id,
            updated_at: new Date(Date.now()).toISOString(),
          });
        }

        if(req.params.form_type_id == 3){
          const form = await IncentiveForms.findOne(
            {
              where: {
                id: req.params.research_id,
              },
            },
          );

          if (!form) {
            res.status(NOT_FOUND).json({
              Message: `No matching Research with id ${req.params.id}`,
            });
            return;
          }

          await form.update({
            status_id: req.body.status_id,
            updated_by: req.user.id,
            updated_at: new Date(Date.now()).toISOString(),
          });
        }

        res.status(OK).json({
          Endorsements: endorsementss,
          Message: "Approving entry updated.",
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

  endorseResearch: async (req, res) => {
    req.body.action = 'endorse';
    return require('../research/research_workflow_controller').ResearchWorkflowController.review(req, res);
  },

  reevaluateResearch: async (req, res) => {
    req.body.action = 'request_revision';
    return require('../research/research_workflow_controller').ResearchWorkflowController.review(req, res);
  },

  update: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {

        const endorsementss = await Endorsements.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!endorsementss) {
          res.status(NOT_FOUND).json({
            Message: `No matching Endorsements entry with id ${req.params.id}`,
          });
          return;
        }

        if (Number(endorsementss.form_type_id) === 1) return res.status(403).json({ message: 'Research endorsements are managed by the research workflow.' });

        await endorsementss.update({
          research_id: req.body.research_id,
          endorsement_rep_id: req.body.endorsement_rep_id,
          // endorsement_rep_name: req.body.endorsement_rep_name,
          // status: req.body.status,
          status_id: req.body.status_id,
          remarks: req.body.remarks,
          form_type_id: req.body.form_type_id,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          Endorsements: endorsementss,
          Message: "Endorsements entry updated.",
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
        const endorsementss = await Endorsements.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!endorsementss) {
          res.status(NOT_FOUND).json({
            Message: `No matching Endorsements entry with id : ${req.params.id}`,
          });

          return;
        }
        if (Number(endorsementss.form_type_id) === 1) return res.status(403).json({ message: 'Research endorsements are managed by the research workflow.' });

        await endorsementss.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `Endorsements entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },


};

module.exports.EndorsementsController = EndorsementsController;
