const { Validator } = require("../../core/validator");

const EndorsementRepresentativeValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.EndorsementRepresentativeValidator = EndorsementRepresentativeValidator;