const NotificationToken = require('../../models/NotificationToken');
const sendNotifications = require('../utils/sendNotifications');

module.exports = async function sendBroadcastMessageTask(snap, context) {
  //const messageId   = context.params.messageId;
  const message     = snap.data();

  // Get all user devices' tokens
  const tokens = (await NotificationToken.getAll()).map(notificationToken => notificationToken.token);

  // Send to all devices
  return await sendNotifications(tokens, {
    title:            message.title,
    body:             message.body,
    icon_image_url:   message.image_url,
    click_action:     message.click_action
  });
};