const { Validator } = require("../../core/validator");

const sAssistanceFormProofsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.sAssistanceFormProofsValidator = sAssistanceFormProofsValidator;