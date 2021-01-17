const express = require('express');
const router = express.Router();
const webAuth = require('../middlewares/webAuth');
const roleCheck = require('../middlewares/roleCheck');
const orderController = require('../controllers/orderController');
const orderStates = require('../../models/orderStates');
const { USER_ROLES_DELIVERER } = require("../../constants");
const { USER_ROLES_SELLER } = require("../../constants");
const { USER_ROLES_USER } = require("../../constants");
const { PAYMENT_METHOD_COD } = require("../../constants");
const { check } = require('express-validator');

router.use(webAuth.verifyToken);

// Add a new order (from user)
router.put('/', [
  check('message').exists().isString(),
  check('payment_method').exists().isIn([PAYMENT_METHOD_COD])
],
  roleCheck.verifyRoles(USER_ROLES_USER),
  orderController.addNewOrder
);

// Update order state (from seller, deliverer)
router.post('/state', [
  check('order_state').exists().isIn(orderStates)
],
  roleCheck.verifyRoles(USER_ROLES_USER, [USER_ROLES_SELLER, USER_ROLES_DELIVERER]),
  orderController.updateOrderState
);

// Update order current location (from deliverer)

// Cancel a order (from user, seller)


module.exports = router;

