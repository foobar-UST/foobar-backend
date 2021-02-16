const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require("../validator/validate");
const verifyRoles = require("../middlewares/verifyRoles");
const verifyIdToken = require("../middlewares/verifyIdToken");
const UserRole = require("../../models/UserRole");
const { updateUserDetailValidationRules } = require("../validator/userValidators");

router.use(verifyIdToken);
router.use(verifyRoles([UserRole.USER]));

// Update user detail
router.post('/',
  updateUserDetailValidationRules(), validate,
  userController.updateUserDetail
);

module.exports = router;