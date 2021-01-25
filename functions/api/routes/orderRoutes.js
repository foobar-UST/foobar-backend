const express = require('express');
const router = express.Router();
const webAuth = require('../middlewares/webAuth');
const roleCheck = require('../middlewares/roleCheck');
const orderController = require('../controllers/orderController');
const SectionState = require("../../models/SectionState");
const { USER_ROLES_SELLER } = require("../../constants");
const { USER_ROLES_USER } = require("../../constants");
const { PAYMENT_METHOD_COD } = require("../../constants");
const { check } = require('express-validator');

router.use(webAuth.verifyToken);

// User: Add a new order
router.put('/', [
  check('message').optional().isString(),
  check('payment_method').exists().isIn([PAYMENT_METHOD_COD])
],
  roleCheck.verifyRoles([USER_ROLES_USER]),
  orderController.placeOrder
);

// User: Cancel the order
router.post('/cancel', [
  check('order_id').exists().isString()
],
  roleCheck.verifyRoles([USER_ROLES_USER]),
  orderController.cancelOrder
);

// Seller: Update order state
router.post('/update', [
  check('order_id').exists().isString(),
  check('order_state').exists().isIn(Object.values(SectionState))
],
  roleCheck.verifyRoles([USER_ROLES_USER, USER_ROLES_SELLER]),
  orderController.updateOrderState
);

// Seller: Confirm pickup order delivered
router.post('/pickup/complete');

// Deliverer: Update order location ('/deliver/location')
router.post('/deliver/location');

// Deliverer: Conform order delivered ('/deliver/complete')
router.post('/deliver/complete');

module.exports = router;

