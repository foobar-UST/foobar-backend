const { ORDER_STATE_CANCELLED } = require("../constants");
const { ORDER_STATE_DELIVERED } = require("../constants");
const { ORDER_STATE_READY_FOR_PICK_UP } = require("../constants");
const { ORDER_STATE_IN_TRANSIT } = require("../constants");
const { ORDER_STATE_PREPARING } = require("../constants");
const { ORDER_STATE_PROCESSING } = require("../constants");

const OrderState = Object.freeze({
  PROCESSING: ORDER_STATE_PROCESSING,
  PREPARING: ORDER_STATE_PREPARING,
  IN_TRANSIT: ORDER_STATE_IN_TRANSIT,
  READY_FOR_PICK_UP: ORDER_STATE_READY_FOR_PICK_UP,
  DELIVERED: ORDER_STATE_DELIVERED,
  CANCELLED: ORDER_STATE_CANCELLED
});

module.exports = OrderState;