const express = require('express');
const router = express.Router();
const { db } = require('../config');
const { TEST_COLLECTION } = require('../constants');

// Return a 'Hello World!' response
router.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!');
});

// Create a test document
router.post('/create-test', (req, res) => {
  (async() => {
    try {
      await db.collection(TEST_COLLECTION)
        .doc(req.body.id)
        .set(req.body.item)
      
      return res.status(200).send('Test item added to database');
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  })();
});

module.exports = router;