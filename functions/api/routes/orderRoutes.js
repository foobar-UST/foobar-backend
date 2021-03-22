const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const UserRole = require("../../models/UserRole");
const validateResult = require('../middlewares/validateResult');
const verifyRoles = require("../middlewares/verifyRoles");
const verifyIdToken = require("../middlewares/verifyIdToken");
const { placeOrderValidationRules,
  updateOrderStateValidationRules,
  cancelOrderValidationRules,
  confirmOrderDeliveredValidationRules,
  rateOrderValidationRules
} = require('../validator/orderValidators');

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

// Deliverer: Confirm order is delivered
router.post('/delivered',
  confirmOrderDeliveredValidationRules(), validateResult,
  verifyRoles([UserRole.USER, UserRole.DELIVERER]),
  orderController.confirmOrderDelivered
);

// User: Rate order
router.put('/rate',
  rateOrderValidationRules(), validateResult,
  verifyRoles([UserRole.USER]),
  orderController.rateOrder
);

module.exports = router;

