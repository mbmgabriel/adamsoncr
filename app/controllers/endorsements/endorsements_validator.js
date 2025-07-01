const { Validator } = require("../../core/validator");

const EndorsementsValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.EndorsementsValidator = EndorsementsValidator;