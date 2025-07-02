const { Validator } = require("../../core/validator");

const researchInvestigatorsValidator = (body, res) => {
  const rules = {
    first_name: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.researchInvestigatorsValidator = researchInvestigatorsValidator;