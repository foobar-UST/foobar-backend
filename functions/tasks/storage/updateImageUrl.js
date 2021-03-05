const { basename } = require('path');
const User = require("../../models/User");
const Seller = require("../../models/Seller");
const SellerItem = require("../../models/SellerItem");
const Advertise = require("../../models/Advertise");
const ItemCategory = require("../../models/ItemCategory");
const generateResizedImageUrl = require('../../utils/generateResizedImageUrl');
const { USER_PHOTOS_FOLDER,
  SELLER_IMAGES_FOLDER,
  ITEM_IMAGES_FOLDER,
  ADVERTISE_IMAGES_FOLDER,
  ITEM_CATEGORIES_IMAGES_FOLDER } = require("../../constants");

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
    default: {
      console.log(`Not a target folder: ${targetFolder}`);
    }
  }

  return true;
};

async function updateUserPhoto(object, userId) {
  const imageUrl = await generateResizedImageUrl(object, 200, 200);

  if (imageUrl !== null) {
    await Promise.all([
      User.updateAuth(userId, { photoURL: imageUrl }),
      User.updateUser(userId, { photo_url: imageUrl })
    ]);
  }
}

async function updateSellerImage(object, sellerId) {
  const imageUrl = await generateResizedImageUrl(object, 1280, 720);

  if (imageUrl !== null) {
    await Seller.updateDetail(sellerId, { image_url: imageUrl });
  }
}

async function updateSellerItemImage(object, itemId) {
  const imageUrl = await generateResizedImageUrl(object, 1280, 720);

  if (imageUrl !== null) {
    await SellerItem.updateDetail(itemId, { image_url: imageUrl });
  }
}

async function updateAdvertiseImage(object, sellerId) {
  const imageUrl = await generateResizedImageUrl(object, 1280, 720);

  if (imageUrl !== null) {
    await Advertise.updateDetail(sellerId, { image_url: imageUrl });
  }
}

async function updateItemCategoryImage(object, itemCategoryId) {
  const imageUrl = await generateResizedImageUrl(object, 1280, 720);

  if (imageUrl !== null) {
    await ItemCategory.update(itemCategoryId, { image_url: imageUrl });
  }
}
