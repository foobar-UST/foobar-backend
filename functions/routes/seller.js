const express = require('express');
const router = express.Router();
const { db, webAuth } = require('../config');
var Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();

router.use(webAuth);

router.get('/', async function(req, res, next) {
  let uid = req.uid;
  let seller = await db.collection('sellers_basic').doc(uid).get();
  if (seller.exists) {
    return res.status(200).send(seller.data());
  }
  return res.status(500).send("Seller does not exists");
});

router.post('/create',async function(req, res, next) {
  if (!(req.body.item instanceof Array)) {
    return res.status(500).send("item is not an array!");
  }
  let itemArr = req.body.item;
  try {
    itemArr.forEach(async function (item, index) {
      await db.collection('sellers').doc(item.id).create(item);
      await db.collection('sellers_basic').doc(item.id).create({
        id: item.id,
        close_time: item.close_time, 
        description: item.description, 
        image_url: item.image_url, 
        min_spend: item.min_spend, 
        name: item.name, 
        open_time: item.open_time, 
        rating: item.rating, 
        type: item.type,
      });
    });
    return res.status(200).send("Item added to database");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;