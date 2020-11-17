const express = require('express');
const router = express.Router();
const { db, webAuth } = require('../config');
const { SELLERS_COLLECTION } = require('../constants');

router.use(webAuth);

// Get seller detail
router.get('/', async (req, res, next) => {
  let seller_id = req.body.seller_id;
  let seller = await db.collection(SELLERS_COLLECTION).doc(seller_id).get();

  if (seller.exists) {
    return res.status(200).send(seller.data());
  }

  return res.status(500).send('Seller does not exist');
});

// Create seller
router.post('/create', async (req, res, next) => {
  let seller = req.body.seller;

  try {
    await db.collection(SELLERS_COLLECTION).doc(seller.id).set(seller);
    return res.status(200).send('New seller added');
  } catch(err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
