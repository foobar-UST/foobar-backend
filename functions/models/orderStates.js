const { ORDER_STATE_CANCELLED } = require("../constants");
const { ORDER_STATE_DELIVERED } = require("../constants");
const { ORDER_STATE_READY_FOR_PICK_UP } = require("../constants");
const { ORDER_STATE_IN_TRANSIT } = require("../constants");
const { ORDER_STATE_PREPARING } = require("../constants");
const { ORDER_STATE_PROCESSING } = require("../constants");

const orderStates = [
  ORDER_STATE_PROCESSING,
  ORDER_STATE_PREPARING,
  ORDER_STATE_IN_TRANSIT,
  ORDER_STATE_READY_FOR_PICK_UP,
  ORDER_STATE_DELIVERED,
  ORDER_STATE_CANCELLED
];

module.exports = orderStates;