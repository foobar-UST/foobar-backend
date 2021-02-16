const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const validateResult = require("../middlewares/validateResult");
const verifyRoles = require("../middlewares/verifyRoles");
const verifyIdToken = require("../middlewares/verifyIdToken");
const UserRole = require("../../models/UserRole");
const { updateUserCartItemValidationRules } = require("../validator/cartValidators");
const { addUserCartItemValidationRules } = require("../validator/cartValidators");

router.use(verifyIdToken);
router.use(verifyRoles([UserRole.USER]));

// Add cart item for user
router.put('/',
  addUserCartItemValidationRules(), validateResult,
  cartController.addUserCartItem
);

// Update cart item for user
router.post('/',
  updateUserCartItemValidationRules(), validateResult,
  cartController.updateUserCartItem
);

// Remove all cart items of a user
router.delete('/', cartController.clearUserCart);

// Sync user cart items with seller items
router.post('/sync', cartController.syncUserCart);

module.exports = router;


