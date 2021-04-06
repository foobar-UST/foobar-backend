const Order = require("../../models/Order");
const { SectionState } = require("../../models/SectionState");
const { toOrderState } = require("../../models/SectionState");

module.exports = async function linkSectionStateToOrderStateTask(change, context) {
  const sectionId = context.params.sectionId;
  const prevSectionDetail = change.before.data();
  const newSectionDetail = change.after.data();

  // No state change.
  if (prevSectionDetail.state === newSectionDetail.state) {
    return true;
  }

  // No need to sync order state if section is still 'available' or 'delivered'.
  if (newSectionDetail.state === SectionState.AVAILABLE ||
      newSectionDetail.state === SectionState.DELIVERED) {
    return true;
  }

  // Get the associated orders.
  const orderIdsSnapshot = await Order.getOrderDetailCollectionRef()
    .where('section_id', '==', sectionId)
    .get();

  const orderIds = orderIdsSnapshot.docs.map(doc => doc.data().id);
  const newOrderState = toOrderState(newSectionDetail.state);

  const updateOrderStatePromises = orderIds.map(orderId => {
    return Order.updateDetail(orderId, {
      state: newOrderState
    });
  });

  return await Promise.all(updateOrderStatePromises);
};