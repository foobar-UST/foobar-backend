const { USER_ROLES_DELIVERER } = require("../../constants");
const { USER_ROLES_SELLER } = require("../../constants");
const { USER_ROLES_USER } = require("../../constants");

const UserRole = Object.freeze({
  USER: USER_ROLES_USER,
  SELLER: USER_ROLES_SELLER,
  DELIVERER: USER_ROLES_DELIVERER
});

module.exports = UserRole;