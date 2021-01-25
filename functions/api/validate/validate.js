const { sendErrorResponse } = require("../responses/sendResponse");
const { INVALID_REQUEST_PARAMS } = require("../responses/ResponseMessage");
const { validationResult } = require('express-validator');

const validate = (validators, allowExtraFields = false) => {
  return async (req, res, next) => {
    // You can make the validation optional
    if (!allowExtraFields) {
      // Fields validation
      const extraFields = checkIfExtraFields(validators, req);
      if (extraFields) {
        return sendErrorResponse(res, 400, INVALID_REQUEST_PARAMS);
      }
    }
    // Type validation
    await Promise.all(validators.map((validator) => validator.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    console.log(`${req.ip} try to make a invalid request`);
    return sendErrorResponse(res, 400, INVALID_REQUEST_PARAMS);
  }
}

function checkIfExtraFields(validators, req) {
  const allowedFields = validators.reduce((fields, rule) => {
    return [...fields, ...rule.builder.fields]
  }, []).sort();

  // Check for all common request inputs
  const requestInput = { ...req.query, ...req.params, ...req.body };
  const requestFields = Object.keys(requestInput).sort();

  if (JSON.stringify(allowedFields) === JSON.stringify(requestFields)) {
    return false;
  }
  console.log(`${req.ip} try to make a invalid request`);
  return true;
}

module.exports = validate;