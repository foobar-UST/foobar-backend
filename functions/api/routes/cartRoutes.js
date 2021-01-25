const express = require('express');
const router = express.Router();
const webAuth = require('../middlewares/webAuth');
const roleCheck = require('../middlewares/roleCheck');
const cartController = require('../controllers/cartController');
const { USER_ROLES_USER } = require("../../constants");
const { check } = require('express-validator');

router.use(webAuth.verifyToken);
router.use(roleCheck.verifyRoles([USER_ROLES_USER]));

// Add cart item for user
router.put('/', [
  check('item_id').exists().isString(),
  check('amounts').exists().isInt({ min: 1 }),
  check('section_id').optional().isString()
], cartController.addUserCartItem);

// Update cart item for user
router.post('/', [
  check('cart_item_id').exists().isString(),
  check('amounts').exists().isInt({ min: 0 })
], cartController.updateUserCartItem);

// Remove all cart items of a user
router.delete('/', cartController.clearUserCart);

// Sync user cart items with seller items
router.post('/sync', cartController.syncUserCart);

module.exports = router;


