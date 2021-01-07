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
    console.log(`Not a image. Type required 'image/*'.`);
    return false;
  }

  // Check if the filename contains extension
  const hasExtension      = fileName.includes('.');
  const fileRoot          = hasExtension ? fileName.substring(0, fileName.indexOf('.')) : fileName;       // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2'

  if (filePath.includes(USER_PHOTOS_FOLDER)) {
    // Generate a compressed image for users
    const imageUrl = await generateResizedImageUrl(object, 720);

    if (imageUrl !== null) {
      return await Promise.all([
        User.updateAuth(fileRoot, { photoURL: imageUrl }),
        User.updateUser(fileRoot, { photo_url: imageUrl })
      ]);
    }
  } else if (filePath.includes(SELLER_IMAGES_FOLDER)) {
    // Generate a compressed image for sellers
    const imageUrl = await generateResizedImageUrl(object, 1080);

    if (imageUrl !== null) {
      return await Seller.updateDetail(fileRoot, { image_url: imageUrl });
    }
  }

  return true;
};