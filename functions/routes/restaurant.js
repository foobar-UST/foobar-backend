const express = require('express');
const router = express.Router();
const {db} = require('../config');
var Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();


//testing api
router.get('/', async function(req, res, next) {
  return res.status(200).send('Hello World!');
});

router.post('/create',async function(req, res, next) {
  if (!(req.body.item instanceof Array)) {
    return res.status(500).send("item is not an array!");
  }
  let itemArr = req.body.item;
  try {
    itemArr.forEach(async function (item, index) {
      await db.collection('sellers').doc(item.DocumentID_id).create(item);
    });
    return res.status(200).send("Item added to database");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;