const express = require('express');
const router = express.Router();
const webAuth = require('../middlewares/webAuth');
const testController = require('../controllers/testController');

// Return a 'Hello World!' response
router.get('/hello-world', webAuth.verifyToken, testController.hello_world);

module.exports = router;