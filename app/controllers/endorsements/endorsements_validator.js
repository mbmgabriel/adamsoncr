const { Validator } = require("../../core/validator");

const endorsementsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.endorsementsValidator = endorsementsValidator;