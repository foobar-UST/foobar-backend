const { sendSuccessResponse } = require("../responses/sendResponse");

const hello_world = (req, res) => {
  return sendSuccessResponse(res, { value: 'Hello World!' });
};

module.exports = {
  hello_world
};