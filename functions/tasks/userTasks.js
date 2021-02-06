const { functions } = require('../config');
const { USERS_COLLECTION } = require('../constants');
const copyAuthToUsers = require('./user/copyAuthToUsers');
const deleteUserResourcesTask = require('./user/deleteUserResources');
const linkUsersPublicDeliveryTask = require('./user/linkUsersPublicDelivery');

exports.copyAuthToUsers = functions.auth.user()
  .onCreate(copyAuthToUsers);

exports.deleteUser = functions.auth.user()
  .onDelete(deleteUserResourcesTask);

exports.linkUserCollections = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}`)
  .onWrite(linkUsersPublicDeliveryTask);



