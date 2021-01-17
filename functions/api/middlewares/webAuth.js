const { sendErrorResponse } = require("../responses/sendResponse");
const { admin } = require('../../config');
const { AUTH_ERROR_DECODE, AUTH_ERROR_NO_TOKEN } = require("../responses/ResponseMessage");

/**
 * Verify the identity of the user by parsing the id token.
 * Add req.currentUser which is a FirebaseUser object.
 */
module.exports.verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization;

  if (idToken) {
    try {
      req.currentUser = await admin.auth().verifyIdToken(idToken);
      return next();
    } catch (err) {
      return sendErrorResponse(res, 401, AUTH_ERROR_DECODE);
    }
  } else {
    return sendErrorResponse(res, 401, AUTH_ERROR_NO_TOKEN);
  }
};