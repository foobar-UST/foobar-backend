const { admin } = require('../config');
const { tmpdir } = require('os');
const { basename, dirname, join } = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs-extra');

const RESIZED_IMAGE_INFIX = '@s_';

/**
 * Generate a resized image url
 * @param object
 * @param width of the resized image
 * @param height of the resized image
 * @returns url of the resized image if success, null if failed
 */
module.exports = async function generateResizedImage(object, width, height) {
  // Original image
  const filePath        = object.name;                                // '/user_photos/fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'
  const fileContentType = object.contentType;                         // 'image/jpeg'
  const fileDir         = dirname(filePath);                          // '/user_photos/'
  const fileName        = basename(filePath);                         // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'
  const bucket          = admin.storage().bucket(object.bucket);

  // Return null if the input is already a resized image
  if (fileName.includes(RESIZED_IMAGE_INFIX)) {
    console.log('Input is already a resized image.');
    return null;
  }

  // Working directory
  // Fixed an issue when the second resized image is the same as the first one
  // https://stackoverflow.com/questions/53986518/thumbnail-generated-from-first-image-is-duplicated-for-others-on-firebase-storag
  const tempLocalDir      = join(`${tmpdir()}/${uuidv4()}`, 'resize');                // '/tmp/uuid/resize'
  const tempLocalPath     = join(tempLocalDir, fileName);                                   // '/tmp/uuid/resize/1610011614287_fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'

  // Create working directory
  await fs.ensureDir(tempLocalDir);

  // Download original image to working directory
  await bucket.file(filePath).download({ destination: tempLocalPath });

  // Check if the filename contains extension
  const hasExtension      = fileName.includes('.');

  // Output image
  const outputExt         = hasExtension ? fileName.split('.').pop() : '';                                   // 'jpg'
  const outputPrefix      = hasExtension ? fileName.replace(`.${outputExt}`, '') : fileName;   // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2'
  const outputName        = hasExtension ? `${outputPrefix}${RESIZED_IMAGE_INFIX}${width}_${height}.${outputExt}` :
                                           `${outputPrefix}${RESIZED_IMAGE_INFIX}${width}_${height}`;                 // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2@s_100.jpg'
  const outputTempPath    = join(tempLocalDir, outputName);                                                           // '/tmp/uuid/resize/fFFdrdmz9zeyw7rWNjhrJaXnVOh2@s_100.jpg'
  const outputBucketPath  = join(fileDir, outputName);                                                                // '/user_photos/fFFdrdmz9zeyw7rWNjhrJaXnVOh2@s_100.jpg'

  // Preform resize operation
  await sharp(tempLocalPath).resize({ width: width, height: height }).toFile(outputTempPath);

  // Upload output to bucket
  await bucket.upload(outputTempPath, {
    destination: outputBucketPath,
    metadata: {
      metadata: { firebaseStorageDownloadTokens: uuidv4() }
    }
  });

  // Clean up working directory
  await fs.remove(tempLocalDir);

  // Generate signed url
  const expireDay = new Date();
  expireDay.setFullYear(expireDay.getFullYear() + 10);

  return (await bucket.file(outputBucketPath)
      .getSignedUrl({
        action:   'read',
        expires:  expireDay
      })
  ).toString();
}
