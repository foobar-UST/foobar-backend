const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const UserRole = require("../../models/UserRole");
const validateResult = require('../middlewares/validateResult');
const verifyRoles = require("../middlewares/verifyRoles");
const verifyIdToken = require("../middlewares/verifyIdToken");
const { placeOrderValidationRules,
  confirmOrderDeliveredValidationRules,
  updateOrderLocationValidationRules,
  updateOrderStateValidationRules,
  cancelOrderValidationRules,
  rateOrderValidationRules } = require("../validator/orderValidators");

router.use(verifyIdToken);

// User: Add a new order
router.put('/',
  placeOrderValidationRules(), validateResult,
  verifyRoles([UserRole.USER]),
  orderController.placeOrder
);

// User/Seller: Cancel the order
router.post('/cancel',
  cancelOrderValidationRules(), validateResult,
  verifyRoles([UserRole.USER, UserRole.SELLER]),
  orderController.cancelOrder
);

// Seller: Update order state
router.post('/update',
  updateOrderStateValidationRules(), validateResult,
  verifyRoles([UserRole.USER, UserRole.SELLER]),
  orderController.updateOrderState
);

// Deliverer: Update order location ('/deliver/location')
router.post('/deliver/location',
  updateOrderLocationValidationRules(), validateResult,
  verifyRoles([UserRole.USER, UserRole.DELIVERER]),
  orderController.updateOrderLocation
);

// Deliverer: Confirm order delivered ('/deliver/confirm')
router.post('/deliver/confirm',
  confirmOrderDeliveredValidationRules(), validateResult,
  verifyRoles([UserRole.USER, UserRole.DELIVERER]),
  orderController.confirmOrderDelivered
);

// Rate order
router.put('/rate',
  rateOrderValidationRules(), validateResult,
  verifyRoles([UserRole.USER]),
  orderController.rateOrder
);

module.exports = router;

