const functions = require('firebase-functions');
const { BROADCAST_MESSAGES_COLLECTION } = require('../constants');
const resizeImageTask = require('./common/resizeImage');
const broadcastMessageTask = require('./common/broadcastMessage');

/**
 * Create resized versions of a new image.
 * Triggered when a image is uploaded to Storage.
 */
exports.resizeImage = functions.runWith({ memory: '2GB', timeoutSeconds: 120 })
  .storage
  .object()
  .onFinalize(resizeImageTask);

/**
 * Send a broadcast message to all users' devices.
 * Triggered when a new document is inserted to 'broadcast_messages'.
 */
exports.broadcastMessage = functions.firestore
  .document(`${BROADCAST_MESSAGES_COLLECTION}/{messageId}`)
  .onCreate(broadcastMessageTask);
