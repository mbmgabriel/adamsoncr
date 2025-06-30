const { Validator } = require("../../core/validator");

const ResearchCategoryValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.ResearchCategoryValidator = ResearchCategoryValidator;