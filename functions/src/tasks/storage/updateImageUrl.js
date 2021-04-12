const { basename } = require('path');
const User = require("../../models/User");
const Seller = require("../../models/Seller");
const SellerItem = require("../../models/SellerItem");
const SellerSection = require('../../models/SellerSection');
const Advertise = require("../../models/Advertise");
const ItemCategory = require("../../models/ItemCategory");
const { ITEM_CATEGORY_IMAGE_HEIGHT } = require('../../../constants');
const { ITEM_CATEGORY_IMAGE_WIDTH } = require('../../../constants');
const { ADVERTISE_IMAGE_HEIGHT } = require('../../../constants');
const { ADVERTISE_IMAGE_WIDTH } = require('../../../constants');
const { generateResizedImageUrl } = require('../../utils/generateResizedImageUrl');
const { USER_PHOTO_IMAGE_SIZE } = require('../../../constants');
const { SELLER_IMAGE_HEIGHT } = require('../../../constants');
const { SELLER_IMAGE_WIDTH } = require('../../../constants');
const { USER_PHOTOS_FOLDER } = require("../../../constants");
const { SELLER_IMAGES_FOLDER } = require("../../../constants");
const { ITEM_IMAGES_FOLDER } = require("../../../constants");
const { ADVERTISE_IMAGES_FOLDER } = require("../../../constants");
const { ITEM_CATEGORIES_IMAGES_FOLDER } = require("../../../constants");
const { SELLER_SECTION_IMAGES_FOLDER } = require("../../../constants");
const { SECTION_IMAGE_WIDTH } = require("../../../constants");
const { SECTION_IMAGE_HEIGHT } = require("../../../constants");
const { SELLER_ITEM_IMAGE_WIDTH } = require("../../../constants");
const { SELLER_ITEM_IMAGE_HEIGHT } = require("../../../constants");

module.exports = async function updateImageUrlTask(object) {
  const filePath          = object.name;                                        // 'user_photos/fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'
  const fileContentType   = object.contentType;                                 // 'image/jpeg'
  const fileName          = basename(filePath);                                 // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'

  // Check if the input is a image
  if (!fileContentType.startsWith('image/')) {
    console.log(`Not a image. Type required 'image/*'.`);
    return false;
  }

  // Check if the filename contains extension
  const hasExtension      = fileName.includes('.');
  const targetFolder      = filePath.substring(0, filePath.indexOf('/'));
  const fileRoot          = hasExtension ? fileName.substring(0, fileName.indexOf('.')) : fileName;       // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2'

  switch (targetFolder) {
    case USER_PHOTOS_FOLDER: {
      await updateUserPhoto(object, fileRoot);
      break;
    }
    case SELLER_IMAGES_FOLDER: {
      await updateSellerImage(object, fileRoot);
      break;
    }
    case ITEM_IMAGES_FOLDER: {
      await updateSellerItemImage(object, fileRoot);
      break;
    }
    case ADVERTISE_IMAGES_FOLDER: {
      await updateAdvertiseImage(object, fileRoot);
      break;
    }
    case ITEM_CATEGORIES_IMAGES_FOLDER: {
      await updateItemCategoryImage(object, fileRoot);
      break;
    }
    case SELLER_SECTION_IMAGES_FOLDER: {
      await updateSectionImage(object, fileRoot);
      break;
    }
    default: {
      console.log(`Not a target folder: ${targetFolder}`);
    }
  }

  return true;
};

async function updateUserPhoto(object, userId) {
  const imageUrl = await generateResizedImageUrl(object, USER_PHOTO_IMAGE_SIZE, USER_PHOTO_IMAGE_SIZE);
  if (imageUrl !== null) {
    await Promise.all([
      User.updateAuth(userId, { photoURL: imageUrl }),
      User.updateUser(userId, { photo_url: imageUrl })
    ]);
  }
}

async function updateSellerImage(object, sellerId) {
  const imageUrl = await generateResizedImageUrl(object, SELLER_IMAGE_WIDTH, SELLER_IMAGE_HEIGHT);
  if (imageUrl !== null) {
    await Seller.updateDetail(sellerId, { image_url: imageUrl });
  }
}

async function updateSellerItemImage(object, itemId) {
  const imageUrl = await generateResizedImageUrl(object, SELLER_ITEM_IMAGE_WIDTH, SELLER_ITEM_IMAGE_HEIGHT);
  if (imageUrl !== null) {
    await SellerItem.updateDetail(itemId, { image_url: imageUrl });
  }
}

async function updateAdvertiseImage(object, sellerId) {
  const imageUrl = await generateResizedImageUrl(object, ADVERTISE_IMAGE_WIDTH, ADVERTISE_IMAGE_HEIGHT);
  if (imageUrl !== null) {
    await Advertise.updateDetail(sellerId, { image_url: imageUrl });
  }
}

async function updateItemCategoryImage(object, itemCategoryId) {
  const imageUrl = await generateResizedImageUrl(object, ITEM_CATEGORY_IMAGE_WIDTH, ITEM_CATEGORY_IMAGE_HEIGHT);
  if (imageUrl !== null) {
    await ItemCategory.update(itemCategoryId, { image_url: imageUrl });
  }
}

async function updateSectionImage(object, sectionId) {
  const imageUrl = await generateResizedImageUrl(object, SECTION_IMAGE_WIDTH, SECTION_IMAGE_HEIGHT);
  if (imageUrl !== null) {
    await SellerSection.updateDetail(sectionId, { image_url: imageUrl });
  }
}