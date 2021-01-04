const { sendErrorResponse } = require("../responses/sendResponse");
const { sendSuccessResponse } = require("../responses/sendResponse");

const hello_world = (req, res) => {
  const hasError = req.query.has_error;

  if (hasError === 'true') {
    return sendErrorResponse(res, 404, 'Test error response.');
  }

  return sendSuccessResponse(res, {
    result: 'Success! Hello World!'
  });
};

module.exports = {
  hello_world
};