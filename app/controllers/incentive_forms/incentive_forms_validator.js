const { Validator } = require("../../core/validator");

const incentiveFormsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.incentiveFormsValidator = incentiveFormsValidator;