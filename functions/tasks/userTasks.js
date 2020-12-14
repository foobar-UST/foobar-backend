const functions = require('firebase-functions');
const { USERS_COLLECTION } = require('../constants');
const copyAuthToUsers = require('./users/copyAuthToUsers');
const deleteUserTask = require('./users/deleteUser');
const linkUserCollectionsTask = require('./users/linkUserCollections');

exports.copyAuthToUsers = functions.auth
  .user()
  .onCreate(copyAuthToUsers);

exports.deleteUser = functions.auth
  .user()
  .onDelete(deleteUserTask);

exports.linkUserCollections = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}`)
  .onWrite(linkUserCollectionsTask);



