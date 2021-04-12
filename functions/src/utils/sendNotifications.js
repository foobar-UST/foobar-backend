const { admin } = require('../../config');
const DeviceToken = require('../models/DeviceToken');

module.exports = async function sendNotifications(tokens, notification, data) {
  // No token provided
  if (tokens.length === 0) {
    return true;
  }

  const payload = {
    ...(notification) && { notification: notification },
    ...(data) && { data: data }
  };

  const response = await admin.messaging().sendToDevice(tokens, payload);

  // Remove invalid tokens
  const removeTokenPromises = [];

  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        removeTokenPromises.push(
          DeviceToken.deleteBy('token', tokens[index])
        );
      }
    }
  });

  return await Promise.all(removeTokenPromises);
};