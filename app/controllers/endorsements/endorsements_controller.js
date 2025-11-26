const { Op } = require("sequelize");

const { Endorsements, User, UserAccount, UserRole, StatusTables, sequelize } = require("../../models");
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
          status: req.body.status,
          remarks: req.body.remarks,
          created_at: req.user.id,
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
            'remarks'],
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
            'remarks'],
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
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const endorsementss = await Endorsements.findAll({
          attributes: ['research_id', 'endorsement_rep_id',
            // 'endorsement_rep_name',
            // 'status',
            'status_id',
            'remarks'],
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
