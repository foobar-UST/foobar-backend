const { sendErrorResponse } = require("../responses/sendResponse");
const { INVALID_REQUEST_PARAMS } = require("../responses/ResponseMessage");
const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  sendErrorResponse(res, 400, INVALID_REQUEST_PARAMS);

  return next();
};

module.exports = validate;