const { db } = require('../../config');
const { SELLERS_COLLECTION } = require("../../constants");
const { SELLER_ITEMS_SUB_COLLECTION } = require("../../constants");

class SellerItem {

  static async get(itemId) {
    const document = (await db.collectionGroup(SELLER_ITEMS_SUB_COLLECTION)
        .where('id', '==', itemId)
        .get()
    ).docs[0];

    return document.exists ? document.data() : null;
  }

  static async update(sellerId, itemId, data) {
    const documentRef = db.doc(`${SELLERS_COLLECTION}/${sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/${itemId}`);
    return await documentRef.update(data);
  }
}

module.exports = SellerItem;