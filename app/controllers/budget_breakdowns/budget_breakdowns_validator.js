const { Validator } = require("../../core/validator");

const budgetBreakdownsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.budgetBreakdownsValidator = budgetBreakdownsValidator;