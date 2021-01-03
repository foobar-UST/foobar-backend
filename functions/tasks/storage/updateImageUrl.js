const { basename } = require('path');
const { USER_PHOTOS_FOLDER } = require('../../constants');
const { SELLER_IMAGES_FOLDER } = require("../../constants");
const generateResizedImageUrl = require('../utils/generateResizedImageUrl');
const User = require("../../models/User");
const Seller = require("../../models/Seller");

module.exports = async function updateImageUrlTask(object) {
  const filePath          = object.name;                                        // '/user_photos/fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'
  const fileContentType   = object.contentType;                                 // 'image/jpeg'
  const fileName          = basename(filePath);                                 // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'

  // Check if the input is a image
  if (!fileContentType.startsWith('image/')) {
    return Error('Not a image.');
  }

  // Check if the filename contains extension
  const hasExtension      = fileName.includes('.');
  const fileRoot          = hasExtension ? fileName.substring(0, fileName.indexOf('.')) : fileName;       // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2'

  if (filePath.includes(USER_PHOTOS_FOLDER)) {
    // Generate a compressed image for users
    const userId = fileRoot;
    const imageUrl = await generateResizedImageUrl(object, 720);

    return await Promise.all([
      User.updateAuth(userId, { photoURL: imageUrl }),
      User.updateUser(userId, { photo_url: imageUrl })
    ]);
  } else if (filePath.includes(SELLER_IMAGES_FOLDER)) {
    // Generate a compressed image for sellers
    const sellerId = fileRoot;
    const imageUrl = await generateResizedImageUrl(object, 1080);

    return await Seller.updateDetail(sellerId, { image_url: imageUrl });
  }

  return true;
};