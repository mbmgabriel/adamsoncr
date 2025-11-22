const { Validator } = require("../../core/validator");

const budgetBreakdownDetailsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.budgetBreakdownDetailsValidator = budgetBreakdownDetailsValidator;