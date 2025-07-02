const { Validator } = require("../../core/validator");

const documentTypesValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.documentTypesValidator = documentTypesValidator;