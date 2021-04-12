const { admin } = require('../../../config');
const OrderType = require("../../models/OrderType");
const OrderState = require("../../models/OrderState");
const SellerSection = require("../../models/SellerSection");

module.exports = async function modifyOrderUpdateSectionTask(change, context) {
  const prevOrderDetail = change.before.exists ? change.before.data() : null;
  const newOrderDetail = change.after.exists ? change.after.data() : null;

  // Return if it is not a group order
  const isOnCampusOrder = (prevOrderDetail && prevOrderDetail.type === OrderType.ON_CAMPUS) ||
    (newOrderDetail && newOrderDetail.type === OrderType.ON_CAMPUS);

  if (isOnCampusOrder) {
    return true;
  }

  // TODO: When all individual orders are delivered, set section state to DELIVERED.

  // When a group order is deleted or cancelled, remove the user from the section.
  const removeUserFromSection = !newOrderDetail ||
    (newOrderDetail && newOrderDetail.state === OrderState.CANCELLED);

  if (removeUserFromSection) {
    const userId = prevOrderDetail.user_id;
    const sectionId = prevOrderDetail.section_id;

    return await SellerSection.updateDetail(sectionId, {
      joined_users_ids: admin.firestore.FieldValue.arrayRemove(userId),
      joined_users_count: admin.firestore.FieldValue.increment(-1)
    });
  }

  // When a group order is created, add the user to the section.
  const appendUserToSection = !prevOrderDetail && newOrderDetail;

  if (appendUserToSection) {
    const userId = newOrderDetail.user_id;
    const sectionId = newOrderDetail.section_id;

    return await SellerSection.updateDetail(sectionId, {
      joined_users_ids: admin.firestore.FieldValue.arrayUnion(userId),
      joined_users_count: admin.firestore.FieldValue.increment(1)
    });
  }

  return true;
};