const { admin } = require('../../config');
const OrderType = require("../../models/OrderType");
const SellerSection = require("../../models/SellerSection");
const OrderState = require("../../models/OrderState");

module.exports = async function newOrderUpdateSectionTask(change, context) {
  const prevOrderDetail = change.before.exists ? change.before.data() : null;
  const newOrderDetail = change.after.exists ? change.after.data() : null;

  // Remove joined user id when
  // 1. the group order is deleted.
  // 2. the group order is cancelled.
  const needRemove = (!newOrderDetail && prevOrderDetail.type === OrderType.OFF_CAMPUS) ||
    (newOrderDetail && newOrderDetail.state === OrderState.CANCELLED && newOrderDetail.type === OrderType.OFF_CAMPUS);

  if (needRemove) {
    const sectionId = prevOrderDetail.section_id;
    const userId = prevOrderDetail.user_id;

    return await SellerSection.updateDetail(sectionId, {
      joined_users_ids: admin.firestore.FieldValue.arrayRemove(userId),
      joined_users_count: admin.firestore.FieldValue.increment(-1)
    });
  }

  // Append joined user id when
  // 1. a new group order is created.
  const needUpdate = (!prevOrderDetail && newOrderDetail && newOrderDetail.type === OrderType.OFF_CAMPUS) ||
    (prevOrderDetail.state !== newOrderDetail.state && newOrderDetail.type === OrderType.OFF_CAMPUS);

  if (needUpdate) {
    const sectionId = newOrderDetail.section_id;
    const userId = newOrderDetail.user_id;

    return await SellerSection.updateDetail(sectionId, {
      joined_users_ids: admin.firestore.FieldValue.arrayUnion(userId),
      joined_users_count: admin.firestore.FieldValue.increment(1)
    });
  }

  return true;
};