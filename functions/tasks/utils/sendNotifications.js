const { admin } = require('../../config');
const NotificationToken = require("../../models/NotificationToken");

module.exports = async function sendNotifications(tokens, message) {
  // Construct notification payload
  const payload = {
    notification: {
      title:          message.title,
      body:           message.body,
      icon:           message.icon_image_url,
      click_action:   message.click_action
    }
  };

  // Send to target devices
  const response = await admin.messaging().sendToDevice(tokens, payload);

  console.log('Sent notifications.');

  // Remove invalid tokens
  const removeJobs = [];
  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered'
      ) {
        removeJobs.push(NotificationToken.delete(tokens[index]));
      }
    }
  });

  return await Promise.all(removeJobs);
};