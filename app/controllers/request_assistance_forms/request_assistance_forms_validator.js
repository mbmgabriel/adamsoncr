const { Validator } = require("../../core/validator");

const requestAssistanceFormsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.requestAssistanceFormsValidator = requestAssistanceFormsValidator;