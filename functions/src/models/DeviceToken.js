const { db } = require('../../config');
const { DEVICE_TOKENS_COLLECTION } = require("../../constants");

class DeviceToken {

  static async getBy(field, value) {
    const querySnapshot = await db.collection(DEVICE_TOKENS_COLLECTION)
      .where(field, '==', value)
      .get();

    return querySnapshot.docs.map(doc => doc.data());
  }

  static async getAll() {
    const querySnapshot = await db.collection(DEVICE_TOKENS_COLLECTION).get();
    return querySnapshot.docs.map(doc => doc.data());
  }

  static async create(data) {
    const docRef = db.collection(DEVICE_TOKENS_COLLECTION).doc();

    Object.assign(data, {
      id: docRef.id
    });

    await docRef.set(data, { merge: true });
  }

  static async update(docId, data) {
    const docRef = db.collection(DEVICE_TOKENS_COLLECTION).doc(docId);
    await docRef.update(data);
  }

  static async delete(docId) {
    const docRef = db.collection(DEVICE_TOKENS_COLLECTION).doc(docId);
    await docRef.delete();
  }

  static async deleteBy(field, value) {
    const querySnapshot = await db.collection(DEVICE_TOKENS_COLLECTION)
      .where(field, '==', value)
      .get();

    const deletePromises = querySnapshot.docs.map(doc => {
      return doc.ref.delete();
    })

    await Promise.all(deletePromises);
  }

  /*
  static async create(token, userId) {
    // Check if the token document already existed.
    const querySnapshot = await db.collection(DEVICE_TOKENS_COLLECTION)
      .where('token', '==', token)
      .get();

    const docRef = querySnapshot.empty ? null : querySnapshot.docs[0].ref;

    // Set the document if it exists, if not, create a new document.
    if (docRef)  {
      await docRef.set({
        token: token,
        ...(userId) && { userId: userId }
      }, { merge: true });

      console.log('Set document.');
    } else {
      const newDocRef = db.collection(DEVICE_TOKENS_COLLECTION).doc();

      await newDocRef.set({
        token: token,
        ...(userId) && { userId: userId }
      }, { merge: true });

      console.log('Create new document.');
    }
  }

   */
}

module.exports = DeviceToken;