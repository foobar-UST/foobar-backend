const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyIdToken = require("../middlewares/verifyIdToken");
const verifyRoles = require("../middlewares/verifyRoles");
const UserRole = require("../../models/UserRole");

router.use(verifyIdToken);
router.use(verifyRoles([UserRole.USER, UserRole.SELLER, UserRole.DELIVERER]));

// Check if deliverer is verified
router.get('/verify/deliverer', authController.checkDelivererVerified);

module.exports = router;