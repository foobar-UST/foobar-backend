const functions = require('firebase-functions');
const { USERS_COLLECTION } = require('../constants');
const copyAuthToUsers = require('./users/copyAuthToUsers');
const deleteUserResourcesTask = require('./users/deleteUserResources');
const linkUsersPublicDeliveryTask = require('./users/linkUsersPublicDelivery');

exports.copyAuthToUsers = functions.auth.user()
  .onCreate(copyAuthToUsers);

exports.deleteUser = functions.auth.user()
  .onDelete(deleteUserResourcesTask);

exports.linkUserCollections = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}`)
  .onWrite(linkUsersPublicDeliveryTask);



