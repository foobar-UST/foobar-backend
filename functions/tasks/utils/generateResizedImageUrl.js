const { admin } = require('../../config');
const { tmpdir } = require('os');
const { basename, dirname, join } = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs-extra');

const RESIZED_IMAGE_INFIX = '@s_';

module.exports = async function generateResizedImage(object, width) {
  // Original image
  const filePath        = object.name;                                // '/user_photos/fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'
  const fileContentType = object.contentType;                         // 'image/jpeg'
  const fileDir         = dirname(filePath);                          // '/user_photos/'
  const fileName        = basename(filePath);                         // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'
  const bucket          = admin.storage().bucket(object.bucket);

  // Return if the input is already a resized image
  if (fileName.includes(RESIZED_IMAGE_INFIX)) {
    return new Error('Already a resized image.');
  }

  // Working directory
  const tempLocalDir    = join(tmpdir(), 'resize');                   // '/tmp/resize'
  const tempLocalPath   = join(tempLocalDir, fileName);               // '/tmp/resize/fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'

  // Create working directory
  await fs.ensureDir(tempLocalDir);

  // Download original image to working directory
  await bucket.file(filePath).download({ destination: tempLocalPath });

  // Check if the filename contains extension
  const hasExtension      = fileName.includes('.');

  // Output image
  const outputExt         = hasExtension ? fileName.split('.').pop() : '';                                   // 'jpg'
  const outputPrefix      = hasExtension ? fileName.replace(`.${outputExt}`, '') : fileName;   // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2'
  const outputName        = hasExtension ? `${outputPrefix}${RESIZED_IMAGE_INFIX}${width}.${outputExt}` :
                                           `${outputPrefix}${RESIZED_IMAGE_INFIX}${width}`;                           // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2@s_100.jpg'
  const outputTempPath    = join(tempLocalDir, outputName);                                                           // '/tmp/resize/fFFdrdmz9zeyw7rWNjhrJaXnVOh2@s_100.jpg'
  const outputBucketPath  = join(fileDir, outputName);                                                                // '/user_photos/fFFdrdmz9zeyw7rWNjhrJaXnVOh2@s_100.jpg'

  // Preform resize operation
  await sharp(tempLocalPath).resize({ width: width }).toFile(outputTempPath);

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
  return (await bucket.file(outputBucketPath)
      .getSignedUrl({
        action:   'read',
        expires:  '03-01-2500',
      })
  ).toString();
}
