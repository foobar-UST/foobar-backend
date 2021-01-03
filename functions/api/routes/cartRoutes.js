const express = require('express');
const router = express.Router();
const webAuth = require('../middlewares/webAuth');
const cartController = require('../controllers/cartController');
const { check } = require('express-validator');

router.use(webAuth.verifyToken);

// Add cart item for user
router.put('/', [
  check('seller_id').exists().isString(),
  check('item_id').exists().isString(),
  check('amounts').exists().isInt({ min: 1 })
], cartController.addUserCartItem);

// Update cart item for user
router.post('/', [
  check('cart_item_id').exists().isString(),
  check('amounts').exists().isInt({ min: 0 })
], cartController.updateUserCartItem);

// Remove all cart items of a user
router.delete('/', cartController.clearUserCart);

// Sync user cart items with seller items
router.post('/sync', cartController.syncUserCartItems);

module.exports = router;


