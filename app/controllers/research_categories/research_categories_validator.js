const { Validator } = require("../../core/validator");

const researchCategoryValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.researchCategoryValidator = researchCategoryValidator;