const User = require("../../models/User");
const { USER_ROLES_USER } = require("../../constants");
const { VERIFY_ROLE_INVALID_ROLE } = require("../responses/ResponseMessage");
const { AUTH_ERROR_DECODE } = require("../responses/ResponseMessage");
const { sendErrorResponse } = require("../responses/sendResponse");

/**
 * Verify the role of the user, should use after webAuth.
 * Add req.userDetail which is the document data of 'users'.
 */
module.exports.verifyRoles = (must, any) => {
  return async (req, res, next) => {
    if (!req.currentUser) {
      return sendErrorResponse(res, 401, AUTH_ERROR_DECODE);
    }

    // Check if the user has the compulsory rule and any additional roles.
    const userId      = req.currentUser.uid;
    const userDetail  = await User.getUserDetail(userId);
    const userRoles   = userDetail.roles;

    // Return if the user has not been assigned any role.
    if (!userDetail || !userDetail.roles || userDetail.roles.length === 0) {
      return sendErrorResponse(res, 401, VERIFY_ROLE_INVALID_ROLE);
    }

    const fulfilled   = !any ?
                        userRoles.includes(must) :
                        userRoles.includes(must) && userRoles.some(role => any.include(role));

    if (fulfilled) {
      req.userDetail = userDetail;
      return next();
    } else {
      return sendErrorResponse(res, 401, VERIFY_ROLE_INVALID_ROLE);
    }
  }
};