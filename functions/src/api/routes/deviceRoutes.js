const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const validate = require("../validator/validate");
const verifyFCMToken = require("../middlewares/verifyFCMToken");
const verifyIdToken = require("../middlewares/verifyIdToken");
const verifyRoles = require("../middlewares/verifyRoles");
const UserRole = require("../../models/UserRole");
const {
  insertDeviceTokenValidationRules,
  linkDeviceTokenValidationRules,
  unlinkDeviceTokenValidationRules } = require("../validator/deviceValidators");

// Add device token
router.put('/add',
  insertDeviceTokenValidationRules(), validate,
  verifyFCMToken,
  deviceController.insertDeviceToken
);

// Link a user to a device token
router.post('/link',
  linkDeviceTokenValidationRules(), validate,
  verifyIdToken,
  verifyRoles([UserRole.USER]),
  verifyFCMToken,
  deviceController.linkDeviceTokenToUser
);

// Unlink a user from a device token.
router.post('/unlink',
  unlinkDeviceTokenValidationRules(), validate,
  verifyFCMToken,
  deviceController.unlinkDeviceTokenFromUser
);

module.exports = router;