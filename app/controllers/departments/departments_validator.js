const { Validator } = require("../../core/validator");

const departmentsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.departmentsValidator = departmentsValidator;