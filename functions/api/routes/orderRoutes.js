const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { placeOrderValidationRules } = require("../validator/orderValidators");
const { USER_ROLES_DELIVERER } = require("../../constants");
const { USER_ROLES_SELLER } = require("../../constants");
const { USER_ROLES_USER } = require("../../constants");
const validateResult = require('../middlewares/validateResult');
const verifyRoles = require("../middlewares/verifyRoles");
const verifyIdToken = require("../middlewares/verifyIdToken");
const { confirmOrderDeliveredValidationRules } = require("../validator/orderValidators");
const { updateOrderLocationValidationRules } = require("../validator/orderValidators");
const { updateOrderStateValidationRules } = require("../validator/orderValidators");
const { cancelOrderValidationRules } = require("../validator/orderValidators");

router.use(verifyIdToken);

// User: Add a new order
router.put('/',
  placeOrderValidationRules(), validateResult,
  verifyRoles([USER_ROLES_USER]),
  orderController.placeOrder
);

// User: Cancel the order
router.post('/cancel',
  cancelOrderValidationRules(), validateResult,
  verifyRoles([USER_ROLES_USER]),
  orderController.cancelOrder
);

// Seller: Update order state
router.post('/update',
  updateOrderStateValidationRules(), validateResult,
  verifyRoles([USER_ROLES_USER, USER_ROLES_SELLER]),
  orderController.updateOrderState
);

// Deliverer: Update order location ('/deliver/location')
router.post('/deliver/location',
  updateOrderLocationValidationRules(), validateResult,
  verifyRoles([USER_ROLES_USER, USER_ROLES_DELIVERER]),
  orderController.updateOrderLocation
);

// Deliverer: Confirm order delivered ('/deliver/confirm')
router.post('/deliver/confirm',
  confirmOrderDeliveredValidationRules(), validateResult,
  verifyRoles([USER_ROLES_USER, USER_ROLES_DELIVERER]),
  orderController.confirmOrderDelivered
);

module.exports = router;

