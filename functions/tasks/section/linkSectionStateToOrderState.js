const Order = require("../../models/Order");
const { SectionState } = require("../../models/SectionState");
const { toOrderState } = require("../../models/SectionState");

module.exports = async function linkSectionStateToOrderState(change, context) {
  const sectionId = context.params.sectionId;
  const prevSectionDetail = change.before.data();
  const newSectionDetail = change.after.data();

  // Return if no state change.
  if (prevSectionDetail.state === newSectionDetail.state) {
    return true;
  }

  // No need to update order state if section state is 'available' or 'delivered'.
  if (newSectionDetail.state === SectionState.AVAILABLE ||
      newSectionDetail.state === SectionState.DELIVERED
  ) {
    return true;
  }

  // Get orders that require state update.
  const orderIds = await Order.getOrderIdsBy('section_id', sectionId);
  const newOrderState = toOrderState(newSectionDetail.state);

  const updateStatePromises = orderIds.map(orderId => {
    return Order.updateDetail(orderId, {
      state: newOrderState
    });
  });

  return await Promise.all(updateStatePromises);
};