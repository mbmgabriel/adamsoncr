const { Validator } = require("../../core/validator");

const cAssistanceFormProofsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.cAssistanceFormProofsValidator = cAssistanceFormProofsValidator;