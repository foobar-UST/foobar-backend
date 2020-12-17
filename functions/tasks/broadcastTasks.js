const functions = require('firebase-functions');
const { BROADCAST_MESSAGES_COLLECTION } = require('../constants');
const sendBroadcastMessageTask = require('./broadcast/sendBroadcastMessage');

exports.sendBroadcastMessage = functions.firestore
  .document(`${BROADCAST_MESSAGES_COLLECTION}/{messageId}`)
  .onCreate(sendBroadcastMessageTask);