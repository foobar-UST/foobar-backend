const express = require('express');
const router = express.Router();
const webAuth = require('../middlewares/webAuth');
const testController = require('../controllers/testController');
const { check } = require("express-validator");

//router.use(webAuth.verifyToken);

// Return a 'Hello World!' response
router.get('/hello-world', [
  check('has_error').exists().isBoolean(),
], testController.hello_world);

module.exports = router;