const User = require("../../models/User");
const { VERIFY_ROLE_INVALID_ROLE } = require("../responses/ResponseMessage");
const { VERIFY_ID_TOKEN_INVALID_TOKEN } = require("../responses/ResponseMessage");
const { sendErrorResponse } = require("../responses/sendResponse");

/**
 * Verify the role of the user, should use after webAuth.
 * Add req.userDetail which is the document data of 'user'.
 */
const verifyRoles = roles => {
  return async (req, res, next) => {
    if (!req.currentUser) {
      return sendErrorResponse(res, 401, VERIFY_ID_TOKEN_INVALID_TOKEN);
    }

    // Check if the user has the compulsory rule and any additional roles.
    const userId      = req.currentUser.uid;
    const userDetail  = await User.getUserDetail(userId);
    const userRoles   = userDetail.roles;

    if (!userDetail || !userDetail.roles || userDetail.roles.length === 0) {
      return sendErrorResponse(res, 401, VERIFY_ROLE_INVALID_ROLE);
    }

    const fulfilled   = roles.every(role => userRoles.includes(role));

    if (fulfilled) {
      req.userDetail = userDetail;
      return next();
    } else {
      return sendErrorResponse(res, 401, VERIFY_ROLE_INVALID_ROLE);
    }
  };
};

module.exports = verifyRoles;