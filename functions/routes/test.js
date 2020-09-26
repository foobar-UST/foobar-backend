const express = require('express');
const router = express.Router();
const {db} = require('../config');

//testing api
router.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!');
});

router.post('/create', (req, res) => {
  (async () => {
    try {
      await db.collection('testing').doc('/' + req.body.id + '/').create({item: req.body.item});
      return res.status(200).send("Item added to database");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

module.exports = router;