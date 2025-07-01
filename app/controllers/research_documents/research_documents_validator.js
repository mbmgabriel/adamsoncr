const { Validator } = require("../../core/validator");

const ResearchDocumentsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.ResearchDocumentsValidator = ResearchDocumentsValidator;