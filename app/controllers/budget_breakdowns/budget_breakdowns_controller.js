const { Op } = require("sequelize");

const { BudgetBreakdowns, sequelize } = require("../../models");
const { budgetBreakdownsValidator } = require("../budget_breakdowns/budget_breakdowns_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const BudgetBreakdownsController = {
  create: async (req, res) => {
    const matched = budgetBreakdownsValidator(req.body, res).validate()

    if (!matched) {
      res.status(PRECONDITION_FAILED).json({ message: 'BudgetBreakdowns required' });
    }

    await sequelize.transaction(async (t) => {
      try {
        const budgetBreakdownss = await BudgetBreakdowns.create({
          research_id: req.body.research_id,
          fund_id: req.body.fund_id,
          amount: req.body.amount,
          created_at: req.user.id,
        },
          { transaction: t }
        );
        res.status(CREATED).json({ BudgetBreakdowns: budgetBreakdownss, Message: 'BudgetBreakdowns entry created.' });
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  all: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const budgetBreakdownss = await BudgetBreakdowns.findAll({
          attributes: ['research_id', 'fund_id', 'amount'],
        });

        const response = budgetBreakdownss.map(bb =>({
          research_id: bb.research_id,
          fund_id: bb.fund_id,
          amount: parseFloat(bb.amount).toFixed(2)
        }))

        res.status(OK).json({ BudgetBreakdowns: response });
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });
  },

  // where: {id: req.params.id},
  get: async (req, res) => {
    await sequelize.transaction(async (t) => {
      try {
        const budgetBreakdownss = await BudgetBreakdowns.findAll({
          attributes: ['research_id', 'fund_id', 'amount'],
          where: { id: req.params.id },
        });

        const response = budgetBreakdownss.map(bb =>({
          research_id: bb.research_id,
          fund_id: bb.fund_id,
          amount: parseFloat(bb.amount).toFixed(2)
        }))

        res.status(OK).json({ BudgetBreakdowns: response });
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

        const budgetBreakdownss = await BudgetBreakdowns.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!budgetBreakdownss) {
          res.status(NOT_FOUND).json({
            Message: `No matching BudgetBreakdowns entry with id ${req.params.id}`,
          });
          return;
        }

        await budgetBreakdownss.update({
          research_id: req.body.research_id,
          fund_id: req.body.fund_id,
          amount: req.body.amount,
          updated_by: req.user.id,
          updated_at: new Date(Date.now()).toISOString(),
        });

        res.status(OK).json({
          BudgetBreakdowns: budgetBreakdownss,
          Message: "BudgetBreakdowns entry updated.",
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
        const budgetBreakdownss = await BudgetBreakdowns.findOne(
          {
            where: {
              id: req.params.id,
            },
          },
        );

        if (!budgetBreakdownss) {
          res.status(NOT_FOUND).json({
            Message: `No matching BudgetBreakdowns entry with id : ${req.params.id}`,
          });

          return;
        }
        await budgetBreakdownss.destroy({
          force: false,
          deleted_by: req.user.id,
        });

        res.status(OK).json({
          Message: `BudgetBreakdowns entry Removed.`,
        });
        return;
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
        return;
      }
    });
  },


};

module.exports.BudgetBreakdownsController = BudgetBreakdownsController;
