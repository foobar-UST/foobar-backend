const { admin } = require("../../config");
const SellerSection = require("../../models/SellerSection");
const User = require("../../models/User");
const { SectionState } = require("../../models/SectionState");
const { sendSuccessResponse } = require("../responses/sendResponse");
const { sendErrorResponse } = require("../responses/sendResponse");
const { APPLY_SECTION_DELIVERY_EXISTING_DELIVERY,
  UPDATE_SECTION_LOCATION_INVALID_DELIVERER,
  CANCEL_SECTION_DELIVERY_NO_EXISTING_DELIVERY,
  APPLY_SECTION_DELIVERY_INVALID_PROFILE
} = require("../responses/ResponseMessage");

const updateSectionState = async (req, res) => {
  const sectionId = req.body.section_id;
  const newSectionState = req.body.section_state;

  // Update section state
  await SellerSection.updateDetail(sectionId, {
    state: newSectionState
  });

  return sendSuccessResponse(res);
};

const applySectionDelivery = async (req, res) => {
  const sectionId = req.body.section_id;
  const delivererUid = req.currentUser.uid;
  const userDetail = req.userDetail;

  // Check if the deliverer already has a ongoing delivery
  if (userDetail.section_in_delivery) {
    return sendErrorResponse(res, 403, APPLY_SECTION_DELIVERY_EXISTING_DELIVERY);
  }

  // Check if the deliverer has filled in its contact data
  if (!userDetail.name || !userDetail.phone_num) {
    return sendErrorResponse(res, 403, APPLY_SECTION_DELIVERY_INVALID_PROFILE);
  }

  const updatePromises = [];

  // Update user detail
  updatePromises.push(User.updateUser(delivererUid, {
    section_in_delivery: sectionId
  }));

  // Update section detail
  updatePromises.push(SellerSection.updateDetail(sectionId,{
    state: SectionState.SHIPPED,
    deliverer_id: delivererUid
  }));

  await Promise.all(updatePromises);

  return sendSuccessResponse(res);
};

const cancelSectionDelivery = async (req, res) => {
  const sectionId = req.body.section_id;
  const delivererUid = req.currentUser.uid;
  const userDetail = req.userDetail;

  // Check if the deliverer has a ongoing delivery
  const sectionInDelivery = userDetail.section_in_delivery;

  if (!sectionInDelivery || sectionInDelivery !== sectionId) {
    return sendErrorResponse(res, 403, CANCEL_SECTION_DELIVERY_NO_EXISTING_DELIVERY);
  }

  const sectionDetail = await SellerSection.getDetail(sectionInDelivery);
  const updatePromises = [];

  // Update user detail
  updatePromises.push(User.updateUser(delivererUid, {
    section_in_delivery: admin.firestore.FieldValue.delete()
  }));

  // When the cutoff time is still ahead, set to available state.
  // When the cutoff time is over, set to processing state.
  const restoreSectionState = (() => {
    const cutOffTime = sectionDetail.cutoff_time.toDate().getTime();
    const nowTime = Date.now();
    return cutOffTime >= nowTime ? SectionState.AVAILABLE : SectionState.PROCESSING;
  })();

  // Update section detail
  updatePromises.push(SellerSection.updateDetail(sectionId, {
    state: restoreSectionState,
    deliverer_id: admin.firestore.FieldValue.delete(),
    deliverer_location: admin.firestore.FieldValue.delete(),
    deliverer_travel_mode: admin.firestore.FieldValue.delete()
  }));

  await Promise.all(updatePromises);

  return sendSuccessResponse(res);
};

const updateSectionLocation = async (req, res) => {
  const delivererUid = req.currentUser.uid;
  const sectionId = req.body.section_id;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const travelMode = req.body.mode;

  // Verify deliverer
  const sectionDetail = await SellerSection.getDetail(sectionId);

  if (sectionDetail.deliverer_id !== delivererUid) {
    return sendErrorResponse(res, 403, UPDATE_SECTION_LOCATION_INVALID_DELIVERER);
  }

  // Update section location
  const sectionLocation = new admin.firestore.GeoPoint(latitude, longitude);

  await SellerSection.updateDetail(sectionId, {
    deliverer_location: sectionLocation,
    deliverer_travel_mode: travelMode
  });

  return sendSuccessResponse(res);
};

module.exports = {
  updateSectionState,
  applySectionDelivery,
  cancelSectionDelivery,
  updateSectionLocation
}