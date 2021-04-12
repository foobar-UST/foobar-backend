const { db, admin } = require('../../config');
const { RESIZED_IMAGE_INFIX } = require('../utils/generateResizedImageUrl');
const { deleteStorageFile } = require('../utils/deleteStorageFile');
const { SELLER_SECTION_IMAGES_FOLDER,
  SELLER_SECTIONS_SUB_COLLECTION,
  SELLER_SECTIONS_BASIC_SUB_COLLECTION,
  SELLERS_COLLECTION,
  SECTION_IMAGE_WIDTH,
  SECTION_IMAGE_HEIGHT
} = require('../../constants');

class SellerSection {

  static async getDetail(sectionId) {
    const querySnapshot = await db.collectionGroup(SELLER_SECTIONS_SUB_COLLECTION)
      .where('id', '==', sectionId)
      .get();

    const document = querySnapshot.empty ? null : querySnapshot.docs[0];
    return document.exists ? document.data() : null;
  }

  static async createBasic(sellerId, sectionId, sectionBasic) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_SECTIONS_BASIC_SUB_COLLECTION}/${sectionId}`
    );

    Object.assign(sectionBasic, {
      id: sectionId
    });

    await docRef.set(sectionBasic);
  }

  static async createDetail(sellerId, sectionId, sectionDetail) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_SECTIONS_SUB_COLLECTION}/${sectionId}`
    );

    Object.assign(sectionDetail, {
      id: sectionId
    });

    await docRef.set(sectionDetail, { merge: true });
  }

  static async deleteBasic(sellerId, sectionId) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_SECTIONS_BASIC_SUB_COLLECTION}/${sectionId}`
    );

    await docRef.delete();
  }

  static async updateDetail(sectionId, data) {
    if (!sectionId) return

    const querySnapshot = await db.collectionGroup(SELLER_SECTIONS_SUB_COLLECTION)
      .where('id', '==', sectionId)
      .get();

    const docRef = querySnapshot.empty ? null : querySnapshot.docs[0].ref;

    Object.assign(data, {
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.update(data);
  }

  static async deleteImage(sectionId) {
    const originalFilePath = `${SELLER_SECTION_IMAGES_FOLDER}/${sectionId}`;
    const compressedFilePath = `${SELLER_SECTION_IMAGES_FOLDER}/${sectionId}
      ${RESIZED_IMAGE_INFIX}${SECTION_IMAGE_WIDTH}_${SECTION_IMAGE_HEIGHT}`;

    await Promise.all([
      deleteStorageFile(originalFilePath),
      deleteStorageFile(compressedFilePath)
    ]);
  }
}

module.exports = SellerSection;