const { Op, where } = require("sequelize");

const { Endorsements, User, UserAccount, UserRole, StatusTables, FormTypes, sequelize, Research } = require("../../models");
const { endorsementsValidator } = require("../endorsements/endorsements_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const EndorsementsController = {
  create: async (req, res) => {
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
    await sequelize.transaction(async (t) => {
      try {

        const endorsementss = await Endorsements.findOne(
          {
            where: {
              research_id: req.params.research_id,
              // endorsement_rep_id: req.params.user_account_id
              endorsement_rep_id: req.user.id,
              form_type_id: 1
            },
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
            ]
          },
        );

        const role_id = endorsementss.User.UserAccount.role_id

        if (!endorsementss) {
          res.status(NOT_FOUND).json({
            Message: `No matching Endorsements entry with Research id ${req.params.research_id} or for User ${req.user.id}`,
          });
          return;
        }

        await endorsementss.update({
          status_id: 6,
          remarks: req.body.remarks,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        let researchIsDone = false;
        //if Director, move Research Status to Completed
        if (role_id==7){ 
          const research = await Research.findOne({where: {id: req.params.research_id}});
          await research.update({status_id: 2})
          researchIsDone=true
        }

        res.status(OK).json({
          ResearchCompleted: researchIsDone,
          Message: "Approving entry updated.",
          Endorsements: endorsementss          
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },

  reevaluateResearch: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {

        const endorsementss = await Endorsements.findOne(
          {
            where: {
              research_id: req.params.research_id,
              // endorsement_rep_id: req.params.user_account_id
              endorsement_rep_id: req.user.id,
              form_type_id: 1
            },
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
            ]
          },
        );

        const role_id = endorsementss.User.UserAccount.role_id;
        const endorsement_status = endorsementss.status_id;

        if (role_id !== 2){
          res.status(PRECONDITION_FAILED).json({
            Message: `User is not Allowed this action: Invalid role`,
          });
          return;
        }

        if (!endorsementss) {
          res.status(NOT_FOUND).json({
            Message: `No matching Endorsements entry with Research id ${req.params.research_id} or for User ${req.user.id}`,
          });
          return;
        }

        // move endorsement back to Not yet Reviewed
        await endorsementss.update({
          status_id: 1,
          remarks: req.body.remarks,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        //move Research Status to Reevaluate
        
        const research = await Research.findOne({where: {id: req.params.research_id}});
        await research.update({status_id: 5})

        res.status(OK).json({
          Message: "Research sent back to reevaluation.",
          Endorsements: endorsementss          
        });
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
