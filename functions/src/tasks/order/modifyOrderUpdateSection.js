const { admin } = require('../../../config');
const OrderType = require('../../models/OrderType');
const OrderState = require('../../models/OrderState');
const SellerSection = require('../../models/SellerSection');

module.exports = async function modifyOrderUpdateSectionTask(change, context) {
  const prevOrderDetail = change.before.exists ? change.before.data() : null;
  const newOrderDetail = change.after.exists ? change.after.data() : null;

  const isOrderCreated = !prevOrderDetail && newOrderDetail;
  const isOrderDeleted = !newOrderDetail;

  // Return if the order is an on-campus order.
  if (newOrderDetail && newOrderDetail.type === OrderType.ON_CAMPUS)
    return true;

  // When a group order is deleted or cancelled, remove the user from the section.
  if (isOrderDeleted || newOrderDetail.state === OrderState.CANCELLED) {
    const userId = prevOrderDetail.user_id;
    const sectionId = prevOrderDetail.section_id;

    return await SellerSection.updateDetail(sectionId, {
      joined_users_ids: admin.firestore.FieldValue.arrayRemove(userId),
      joined_users_count: admin.firestore.FieldValue.increment(-1)
    });
  }

  if (isOrderCreated) {
    const userId = newOrderDetail.user_id;
    const sectionId = newOrderDetail.section_id;

    return await SellerSection.updateDetail(sectionId, {
      joined_users_ids: admin.firestore.FieldValue.arrayUnion(userId),
      joined_users_count: admin.firestore.FieldValue.increment(1)
    });
  }

  return true;
};