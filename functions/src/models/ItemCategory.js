const { db } = require('../../config');
const { ITEM_CATEGORIES_COLLECTION } = require("../../constants");

class ItemCategory {

  static async update(itemCategoryId, data) {
    const docRef = db.doc(`${ITEM_CATEGORIES_COLLECTION}/${itemCategoryId}`);
    await docRef.update(data);
  }
}

module.exports = ItemCategory;