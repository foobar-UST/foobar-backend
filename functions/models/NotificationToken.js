const { db } = require('../config');
const { NOTIFICATION_TOKENS_COLLECTION } = require("../constants");

class NotificationToken {

  static async getAll() {
    const snapshot = await db.collection(`${NOTIFICATION_TOKENS_COLLECTION}`).get();
    return snapshot.docs.map(doc => doc.data());
  }

  static async delete(token) {
    const snapshot = await db.collection(`${NOTIFICATION_TOKENS_COLLECTION}`)
      .where('token', '==', token)
      .get();

    const deleteJobs = snapshot.docs.map(doc => doc.ref.delete());

    await Promise.all(deleteJobs);
  }
}

module.exports = NotificationToken;