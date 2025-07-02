const { Validator } = require("../../core/validator");

const endorsementRepresentativeValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.endorsementRepresentativeValidator = endorsementRepresentativeValidator;