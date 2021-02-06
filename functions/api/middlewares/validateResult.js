const { validationResult } = require("express-validator");
const { INVALID_REQUEST_PARAMS } = require("../responses/ResponseMessage");
const { sendErrorResponse } = require("../responses/sendResponse");

/**
 * Check if there is any validation errors from a request. If yes,
 * return error response.
 */
const validateResult = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  sendErrorResponse(res, 400, INVALID_REQUEST_PARAMS);

  return next();
};

module.exports = validateResult;