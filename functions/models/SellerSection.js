const { SELLER_SECTIONS_BASIC_SUB_COLLECTION } = require("../constants");
const { SELLERS_COLLECTION } = require("../constants");
const { db } = require('../config');

class SellerSection {

  static async getDetail(sellerId, sectionId) {
    const document = await db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_SECTIONS_BASIC_SUB_COLLECTION}/${sectionId}`
    ).get();

    return document.exists ? document.data() : null;
  }

  static async createBasic(sellerId, sectionId, sectionBasic) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_SECTIONS_BASIC_SUB_COLLECTION}/${sectionId}`
    );

    await docRef.set(sectionBasic);
  }

  static async deleteBasic(sellerId, sectionId) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_SECTIONS_BASIC_SUB_COLLECTION}/${sectionId}`
    );

    await docRef.delete();
  }
}

module.exports = SellerSection;