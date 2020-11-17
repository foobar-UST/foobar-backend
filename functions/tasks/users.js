const functions = require('firebase-functions');
const { USERS_COLLECTION } = require('../constants');
const deleteUserTask = require('./users/deleteUser');
const copyUserDataTask = require('./users/copyUserData');
const updateDataCompletedTask = require('./users/updateDataCompleted');
const updateUserRolesTask = require('./users/updateUserRoles');

/**
 * Clean up the resources used by a user.
 * Triggered when a user account is removed from Auth.
 */
exports.deleteUser = functions.auth
  .user()
  .onDelete(deleteUserTask);

/**
 * Update the user document in 'users_delivery' and 'users_public' collections. 
 * Triggered when a document is modified in 'users' collection.
 */
exports.copyUserData = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}`)
  .onWrite(copyUserDataTask);

/**
 * Update the 'data_completed' field in 'users'.
 * It will be true only when both the 'name' and 'photo_num' fields are not empty.
 * Triggered when a user document is updated in 'users' collection.
 */
exports.updateUserAllowOrder = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}`)
  .onUpdate(updateDataCompletedTask);

/**
 * Update the 'roles' field in 'users'.
 * Triggered when a user document is created in 'users' collection.
 */
exports.updateUserRole = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}`)
  .onCreate(updateUserRolesTask);