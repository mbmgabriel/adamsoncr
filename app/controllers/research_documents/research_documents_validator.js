const { Validator } = require("../../core/validator");

const researchDocumentsValidator = (body, res) => {
  const rules = {
    // research_id: "required",
    // document_title_id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.researchDocumentsValidator = researchDocumentsValidator;