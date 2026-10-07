const { Validator } = require("../../core/validator");

const sIncentiveTypesValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.sIncentiveTypesValidator = sIncentiveTypesValidator;