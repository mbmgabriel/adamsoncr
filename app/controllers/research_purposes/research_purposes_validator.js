const { Validator } = require("../../core/validator");

const researchValidator = (body, res) => {
  const rules = {
    research_name: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.researchValidator = researchValidator;
