const { Validator } = require("../../core/validator");

const cAttachmentInfosValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.cAttachmentInfosValidator = cAttachmentInfosValidator;