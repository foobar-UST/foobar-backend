const { db } = require('../../config');
const { USER_CARTS_COLLECTION } = require("../../constants");

class UserCart {

  static async get(userId) {
    const document = await db.doc(`${USER_CARTS_COLLECTION}/${userId}`).get();
    return document.exists ? document.data() : null;
  }

  static async update(userId, data) {
    const documentRef = db.doc(`${USER_CARTS_COLLECTION}/${userId}`);
    return await documentRef.update(data);
  }
}

module.exports = UserCart;