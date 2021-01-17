const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { check } = require("express-validator");

// Return a 'Hello World!' response
router.get('/hello-world', [
  check('has_error').exists().isBoolean(),
], testController.hello_world);

module.exports = router;