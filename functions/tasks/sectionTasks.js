const { functions } = require('../config');
const { SELLER_SECTIONS_SUB_COLLECTION, SELLERS_COLLECTION } = require("../constants");
const linkSectionsBasicTask = require('./section/linkSectionsBasic');
const sectionUpdateRequireCartSyncTask = require('./section/sectionUpdateRequireCartSync');
const linkSectionStateToOrderStateTask = require('./section/linkSectionStateToOrderState');
const linkSectionLocationToOrderLocationTask = require('./section/linkSectionLocationToOrderLocation');
const sectionUpdateOrderSyncTask = require('./section/sectionUpdateOrderSync');

// Link with 'sections_basic' sub-collection.
exports.linkSectionsBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_SECTIONS_SUB_COLLECTION}/{sectionId}`)
  .onWrite(linkSectionsBasicTask);

// Update user' cart info when a section is updated.
exports.sectionUpdateRequireCartSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_SECTIONS_SUB_COLLECTION}/{sectionId}`)
  .onWrite(sectionUpdateRequireCartSyncTask);

// Link section state to orders state.
exports.linkSectionStateToOrderState = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_SECTIONS_SUB_COLLECTION}/{sectionId}`)
  .onUpdate(linkSectionStateToOrderStateTask);

// Link section location to order location.
exports.linkSectionLocationToOrderLocation = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_SECTIONS_SUB_COLLECTION}/{sectionId}`)
  .onUpdate(linkSectionLocationToOrderLocationTask);

// Update orders when a section is updated.
exports.sectionUpdateOrderSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_SECTIONS_SUB_COLLECTION}/{sectionId}`)
  .onUpdate(sectionUpdateOrderSyncTask);