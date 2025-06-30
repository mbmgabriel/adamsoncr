const { Validator } = require("../../core/validator");

const DocumentTypesValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.DocumentTypesValidator = DocumentTypesValidator;