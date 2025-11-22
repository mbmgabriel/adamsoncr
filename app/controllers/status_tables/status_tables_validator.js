const { Validator } = require("../../core/validator");

const statusTablesValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.statusTablesValidator = statusTablesValidator;