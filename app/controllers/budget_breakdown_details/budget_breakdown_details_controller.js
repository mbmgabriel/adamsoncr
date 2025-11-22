const { Op } = require("sequelize");

const { BudgetBreakdownDetails, sequelize } = require("../../models");
const { budgetBreakdownDetailsValidator } = require("../budget_breakdown_details/budget_breakdown_details_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const BudgetBreakdownDetailsController = {
  create: async (req, res) => {
    const matched = budgetBreakdownDetailsValidator(req.body, res).validate()

    if (!matched){
      res.status(PRECONDITION_FAILED).json({message: 'BudgetBreakdownDetails required'});
    }

    await sequelize.transaction(async (t) => {
      try {
        const budgetBreakdownDetailss = await BudgetBreakdownDetails.create({
          fund_name: req.body.fund_name,
          fund_desc: req.body.fund_desc,
          created_at: req.user.id,
          },
          { transaction: t }
        );
        res.status(CREATED).json({BudgetBreakdownDetails: budgetBreakdownDetailss, Message: 'BudgetBreakdownDetails entry created.'});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const budgetBreakdownDetailss = await BudgetBreakdownDetails.findAll({
          attributes: ['fund_name','fund_desc'],
        });
        res.status(OK).json({BudgetBreakdownDetails: budgetBreakdownDetailss});
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const budgetBreakdownDetailss = await BudgetBreakdownDetails.findAll({
          attributes: ['fund_name','fund_desc'],
          where: {id: req.params.id},
        });

        res.status(OK).json({BudgetBreakdownDetails: budgetBreakdownDetailss});
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

        const budgetBreakdownDetailss = await BudgetBreakdownDetails.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!budgetBreakdownDetailss) {
          res.status(NOT_FOUND).json({
            Message: `No matching BudgetBreakdownDetails entry with id ${req.params.id}`,
          });
          return;
        }

        await budgetBreakdownDetailss.update({
          fund_name: req.body.fund_name,
          fund_desc: req.body.fund_desc,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          BudgetBreakdownDetails: budgetBreakdownDetailss,
          Message: "BudgetBreakdownDetails entry updated.",
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
        const budgetBreakdownDetailss = await BudgetBreakdownDetails.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!budgetBreakdownDetailss) {
          res.status(NOT_FOUND).json({
            Message: `No matching BudgetBreakdownDetails entry with id : ${req.params.id}`,
          });

          return;
        }
        await budgetBreakdownDetailss.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `BudgetBreakdownDetails entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },
  

};

module.exports.BudgetBreakdownDetailsController = BudgetBreakdownDetailsController;
