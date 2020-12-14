const express = require('express');
const router = express.Router();
const webAuth = require('../middlewares/webAuth');
const cartController = require('../controllers/cartController');
const { check } = require('express-validator');

router.use(webAuth.verifyToken);

// Add cart item for user
router.put('/', [
  check('item_id').exists().isString(),
  check('amounts').exists().isInt({ min: 1 })
], cartController.addUserCartItem);

// Reduce the amount of a cart item
router.post('/', [
  check('cart_item_id').exists().isString()
], cartController.reduceUserCartItem);

module.exports = router;


