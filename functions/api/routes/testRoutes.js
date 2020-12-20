const express = require('express');
const router = express.Router();
const webAuth = require('../middlewares/webAuth');
const testController = require('../controllers/testController');

router.use(webAuth.verifyToken);

// Return a 'Hello World!' response
router.get('/hello-world', testController.hello_world);

module.exports = router;