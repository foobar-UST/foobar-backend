const User = require("../../models/User");

/**
 * Copy data from Auth to 'user' collection when a new user is created.
 */
module.exports = async function copyAuthToUsersTask(user) {
  return await User.createUser(user.uid, {
    email: user.email,
    username: user.email.substring(0, user.email.indexOf('@')),
    roles: ['user']
  });
};