const { Validator } = require("../../core/validator");

const ResearchInvestigatorsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.ResearchInvestigatorsValidator = ResearchInvestigatorsValidator;