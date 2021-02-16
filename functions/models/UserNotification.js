const { db, admin } = require('../config');
const { USER_NOTIFICATIONS_SUB_COLLECTION } = require("../constants");
const { USERS_COLLECTION } = require("../constants");

class UserNotification {

  static async create(userId, notification) {
    const docRef = db.collection(
      `${USERS_COLLECTION}/${userId}/${USER_NOTIFICATIONS_SUB_COLLECTION}`
    ).doc();

    Object.assign(notification, {
      id: docRef.id,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.set(notification);
  }
}

module.exports = UserNotification;