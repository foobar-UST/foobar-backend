const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const validateResult = require("../middlewares/validateResult");
const { searchSellersValidationRules } = require('../validator/sellerValidators');

// Search sellers
router.get('/search',
  searchSellersValidationRules(), validateResult,
  sellerController.searchSellers
);

module.exports = router;