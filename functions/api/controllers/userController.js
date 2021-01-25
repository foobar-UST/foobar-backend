const User = require("../../models/User");
const { sendSuccessResponse } = require("../responses/sendResponse");
const { INVALID_REQUEST_PARAMS } = require("../responses/ResponseMessage");
const { sendErrorResponse } = require("../responses/sendResponse");
const { validationResult } = require("express-validator");

const updateUserDetail = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return sendErrorResponse(res, 400, INVALID_REQUEST_PARAMS);
  }

  const userId = req.currentUser.uid;
  const name = req.body.name;
  const phoneNum = req.body.phone_num;

  if (name || phoneNum) {
    await User.updateUser(userId, {
      name: name,
      phone_num: phoneNum
    });
  }

  return sendSuccessResponse(res);
};

module.exports = {
  updateUserDetail
}