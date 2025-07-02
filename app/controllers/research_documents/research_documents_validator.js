const { Validator } = require("../../core/validator");

const researchDocumentsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.researchDocumentsValidator = researchDocumentsValidator;