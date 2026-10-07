const { Validator } = require("../../core/validator");

const sPeerReviewProofValidator = (body, res) => {
  const rules = {
    // id: "required",
  };
  return new Validator(body, rules, res);
};

module.exports.sPeerReviewProofValidator = sPeerReviewProofValidator;