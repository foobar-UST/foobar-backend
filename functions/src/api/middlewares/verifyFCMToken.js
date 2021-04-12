const { VERIFY_FCM_TOKEN_MISSING_TOKEN } = require("../responses/ResponseMessage");
const { VERIFY_FCM_TOKEN_INVALID_TOKEN } = require("../responses/ResponseMessage");
const { sendErrorResponse } = require("../responses/sendResponse");
const { admin } = require('../../../config');

const verifyFCMToken = async (req, res, next) => {
  const fcmToken = req.body.token;

  if (!fcmToken) {
    return sendErrorResponse(res, 401, VERIFY_FCM_TOKEN_MISSING_TOKEN);
  }

  try {
    await admin.messaging().send({ token: fcmToken }, true);
    req.fcmToken = fcmToken;
    return next();
  } catch (e) {
    return sendErrorResponse(res, 401, VERIFY_FCM_TOKEN_INVALID_TOKEN);
  }
};

module.exports = verifyFCMToken;