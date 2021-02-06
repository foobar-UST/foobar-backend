const express = require('express');
const router = express.Router();
const { USER_ROLES_USER } = require("../../constants");
const userController = require('../controllers/userController');
const validate = require("../validator/validate");
const verifyRoles = require("../middlewares/verifyRoles");
const verifyIdToken = require("../middlewares/verifyIdToken");
const { updateUserDetailValidationRules } = require("../validator/userValidators");

router.use(verifyIdToken);
router.use(verifyRoles([USER_ROLES_USER]));

// Update user detail
router.post('/',
  updateUserDetailValidationRules(), validate,
  userController.updateUserDetail
);

module.exports = router;