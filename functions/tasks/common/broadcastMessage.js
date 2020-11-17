const { admin, db } = require('../../config');
const { NOTIFICATION_TOKENS_COLLECTION } = require('../../constants');

module.exports = async function broadcastMessageTask(snap, context) {
  // Get message
  const messageData = snap.data();

  // Get all users' tokens
  const snapshot = await db.collection(NOTIFICATION_TOKENS_COLLECTION).get();
  const tokens = snapshot.docs.map(doc => doc.data());

  // Notification payload
  // Using default FCM channel
  // See: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
  const payload = {
    notification: {
      title: messageData.title,
      body: messageData.body,
      icon: messageData.image_url,
      click_action: messageData.click_action
    }
  };

  // Send notifications to all tokens
  const response = await admin.messaging().sendToDevice(
    tokens.map(token => token.token), 
    payload
  );

  console.log('Sent broadcast notification to all users.');
  
  // Remove timeout or invalid tokens
  const removeTokenPromises = [];
  response.results.forEach((result, index) => {
    const error = result.error;

    if (error) {
      console.log(`Failed to send notification to ${tokens[index].token}: ${error}`);

      // Cleanup the tokens who are not registered anymore.
      if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
        removeTokenPromises.push(
          db.collection(NOTIFICATION_TOKENS_COLLECTION).doc(tokens[index].id).delete()
        );
      }
    }
  });

  return Promise.all(removeTokenPromises);
};