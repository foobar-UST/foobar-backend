const OrderState = require("../../models/OrderState");
const { PAYMENT_METHOD_COD } = require("../../constants");
const { body } = require('express-validator');

const placeOrderValidationRules = () => {
  return [
    body('message').optional().isString(),
    body('payment_method').exists().isIn([PAYMENT_METHOD_COD])
  ];
};

const cancelOrderValidationRules = () => {
  return [
    body('order_id').exists().isString()
  ];
};

const updateOrderStateValidationRules = () => {
  return [
    body('order_id').exists().isString(),
    body('order_state').exists().isIn(Object.values(OrderState))
  ];
}

const updateOrderLocationValidationRules = () => {
  return [
    body('order_id').exists().isString(),
    body('latitude').exists().isFloat(),
    body('longitude').exists().isFloat()
  ];
};

const confirmOrderDeliveredValidationRules = () => {
  return [
    body('order_id').exists().isString()
  ];
};

module.exports = {
  placeOrderValidationRules,
  cancelOrderValidationRules,
  updateOrderStateValidationRules,
  updateOrderLocationValidationRules,
  confirmOrderDeliveredValidationRules
};

