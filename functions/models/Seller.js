const { db } = require('../config');
const { SELLERS_BASIC_COLLECTION } = require("../constants");
const { SELLERS_COLLECTION } = require("../constants");

class Seller {

  static async getDetail(sellerId) {
    const document = await db.doc(`${SELLERS_COLLECTION}/${sellerId}`).get();
    return document.exists ? document.data() : null;
  }

  static async getBasic(sellerId) {
    const document = await db.doc(`${SELLERS_BASIC_COLLECTION}/${sellerId}`).get();
    return document.exists ? document.data() : null;
  }

  static async deleteBasic(sellerId) {
    const docRef = db.doc(`${SELLERS_BASIC_COLLECTION}/${sellerId}`);
    await docRef.delete();
  }

  static async createBasic(sellerId, sellerBasic) {
    const docRef = db.doc(`${SELLERS_BASIC_COLLECTION}/${sellerId}`);
    await docRef.set(sellerBasic);
  }
}

module.exports = Seller;