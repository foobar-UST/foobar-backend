const { admin } = require('../../../config');
const { sendErrorResponse } = require('../responses/sendResponse');
const { VERIFY_ID_TOKEN_INVALID_TOKEN, VERIFY_ID_TOKEN_MISSING_TOKEN } = require('../responses/ResponseMessage');

/**
 * Verify the identity of the user by parsing the id token.
 * Add req.currentUser which is a [DecodedIdToken] object.
 */
const verifyIdToken = async (req, res, next) => {
  const idToken = req.headers.authorization;

  if (idToken) {
    try {
      // Return a decoded token.
      req.currentUser = await admin.auth().verifyIdToken(idToken);
      return next();
    } catch (err) {
      return sendErrorResponse(res, 401, VERIFY_ID_TOKEN_INVALID_TOKEN);
    }
  } else {
    return sendErrorResponse(res, 401, VERIFY_ID_TOKEN_MISSING_TOKEN);
  }
};

module.exports = verifyIdToken;