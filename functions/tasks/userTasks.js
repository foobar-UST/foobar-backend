const { functions } = require('../config');
const copyAuthToUsersTask = require('./user/copyAuthToUsers');
const deleteUserResourcesTask = require('./user/deleteUserResources');
const linkUsersPublicDeliveryTask = require('./user/linkUsersPublicDelivery');
const updateUserSyncRatingTask = require('./user/updateUserSyncRating');
const { USERS_COLLECTION } = require('../constants');

// Create new user document when a new user account is created in Auth.
exports.copyAuthToUsers = functions.auth.user()
  .onCreate(copyAuthToUsersTask);

// Clean up resources when a user is deleted.
exports.deleteUser = functions.auth.user()
  .onDelete(deleteUserResourcesTask);

// Link with 'users_delivery' and 'users_public'.
exports.linkUserCollections = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}`)
  .onWrite(linkUsersPublicDeliveryTask);

// Update user rating documents.
exports.updateUserSyncRating = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}`)
  .onUpdate(updateUserSyncRatingTask);


