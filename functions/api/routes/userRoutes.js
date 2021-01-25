const express = require('express');
const router = express.Router();
const webAuth = require('../middlewares/webAuth');
const roleCheck = require('../middlewares/roleCheck');
const { check } = require('express-validator');
const validate = require('../validate/validate');
const { USER_ROLES_USER } = require("../../constants");
const userController = require('../controllers/userController');

router.use(webAuth.verifyToken);

// Update user detail
router.post('/', [
  check('name').optional().isString(),
  check('phone_num').optional().isString()
],
  roleCheck.verifyRoles([USER_ROLES_USER]),
  userController.updateUserDetail
);

module.exports = router;