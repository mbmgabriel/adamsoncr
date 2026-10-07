const { Validator } = require("../../core/validator");

const sAttachmentInfosValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.sAttachmentInfosValidator = sAttachmentInfosValidator;