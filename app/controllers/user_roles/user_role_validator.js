const { Validator } = require("../../core/validator");

const userRoleValidator = (body, res) => {
  const rules = {
    role_name: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.userRoleValidator = userRoleValidator;
