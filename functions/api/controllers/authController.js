const Seller = require("../../models/Seller");
const { sendSuccessResponse, sendErrorResponse } = require("../responses/sendResponse");
const { CHECK_DELIVERER_VERIFIED_NO_SELLER } = require("../responses/ResponseMessage");

const checkDelivererVerified = async (req, res) => {
  const userId = req.currentUser.uid;
  const userDetail = req.userDetail;

  // createdRest
  if (!userDetail.createdRest) {
    return sendErrorResponse(res, 403, CHECK_DELIVERER_VERIFIED_NO_SELLER);
  }

  // by_user_id
  const sellerDetail = await Seller.getDetailBy('by_user_id', userId);

  if (!sellerDetail) {
    return sendErrorResponse(res, 403, CHECK_DELIVERER_VERIFIED_NO_SELLER);
  }

  return sendSuccessResponse(res, { verified: true });
};

module.exports = {
  checkDelivererVerified
};