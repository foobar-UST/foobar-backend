const OrderState = require("./OrderState");
const { SELLER_SECTION_STATE_READY_FOR_PICK_UP } = require("../../constants");
const { SELLER_SECTION_STATE_DELIVERED } = require("../../constants");
const { SELLER_SECTION_STATE_SHIPPED } = require("../../constants");
const { SELLER_SECTION_STATE_PREPARING } = require("../../constants");
const { SELLER_SECTION_STATE_PROCESSING } = require("../../constants");
const { SELLER_SECTION_STATE_AVAILABLE } = require("../../constants");

const SectionState = Object.freeze({
  AVAILABLE: SELLER_SECTION_STATE_AVAILABLE,
  PROCESSING: SELLER_SECTION_STATE_PROCESSING,
  PREPARING: SELLER_SECTION_STATE_PREPARING,
  SHIPPED: SELLER_SECTION_STATE_SHIPPED,
  READY_FOR_PICK_UP: SELLER_SECTION_STATE_READY_FOR_PICK_UP,
  DELIVERED: SELLER_SECTION_STATE_DELIVERED
});

const toOrderState = sectionState => {
  let orderState;
  switch (sectionState) {
    case SectionState.AVAILABLE: case SectionState.DELIVERED:
      orderState = null;
      break;

    case SectionState.PROCESSING:
      orderState = OrderState.PROCESSING;
      break;

    case SectionState.PREPARING:
      orderState = OrderState.PREPARING;
      break;

    case SectionState.SHIPPED:
      orderState = OrderState.IN_TRANSIT;
      break;

    case SectionState.READY_FOR_PICK_UP:
      orderState = OrderState.READY_FOR_PICK_UP
      break;
  }

  return orderState;
};

module.exports = {
  SectionState,
  toOrderState
};