const { admin, db } = require('../../config');
const { tmpdir } = require('os');
const { basename, dirname, join } = require('path');
const { v4: uuidv4 } = require('uuid');
const { USER_PHOTOS_FOLDER, USERS_COLLECTION } = require('../../constants');
const sharp = require('sharp');
const fs = require('fs-extra');

const RESIZED_IMAGE_INFIX = '@s_';

module.exports = async function resizeImageTask(object) {
  // File paths
  const contentType     = object.contentType;
  const filePath        = object.name;                                // '/user_photos/fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'
  const fileDir         = dirname(filePath);                          // '/user_photos/'
  const fileName        = basename(filePath);                         // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'
  
  const tempLocalDir    = join(tmpdir(), 'resize');                   // '/tmp/resize'
  const tempLocalPath   = join(tempLocalDir, fileName);               // '/tmp/resize/fFFdrdmz9zeyw7rWNjhrJaXnVOh2.jpg'
 
  const imageExt        = fileName.split('.').pop();                  // 'jpg'
  const imageName       = fileName.replace(`.${imageExt}`, '');       // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2'

  // To avoid infinite resizing-loop, we set the filename
  // of the resized image as 'image@s_1920.png', where s_ 
  // stands for size. Then, we will be able to check if the
  // newly created image is the product of a resizing or not.
  if (fileName.includes(RESIZED_IMAGE_INFIX)) {
    return console.log('Image is already resized.');
  }

  if (!contentType.startsWith('image/')) {
    return console.log('Not a image.');
  }

  const bucket = admin.storage().bucket(object.bucket);

  // Create temp directory for storing output
  await fs.ensureDir(tempLocalDir);
  await bucket.file(filePath).download({ destination: tempLocalPath });

  // Perform resize and upload to bucket
  const widths = [ 1920, 720, 100 ];

  // Upload resized images
  await Promise.all(widths.map(async width => {
    const newImageName        = `${imageName}${RESIZED_IMAGE_INFIX}${width}.${imageExt}`;    // 'fFFdrdmz9zeyw7rWNjhrJaXnVOh2@s_100.jpg'
    const newImageTempPath    = join(tempLocalDir, newImageName);                            // '/tmp/resize/fFFdrdmz9zeyw7rWNjhrJaXnVOh2@s_100.jpg'
    const newImageBucketPath  = join(fileDir, newImageName);                                 // '/user_photos/fFFdrdmz9zeyw7rWNjhrJaXnVOh2@s_100.jpg'

    // Perform resize
    await sharp(tempLocalPath).resize({ width: width }).toFile(newImageTempPath);

    // Upload image to bucket
    return bucket.upload(newImageTempPath, {
      destination: newImageBucketPath,
      metadata: {
        metadata: { firebaseStorageDownloadTokens: uuidv4() }
      }
    });
  }));

  // Generate image url
  if (filePath.includes(USER_PHOTOS_FOLDER)) {
    const uid = imageName;
    const newImageBucketPath = join(fileDir, `${uid}${RESIZED_IMAGE_INFIX}${widths[1]}.${imageExt}`);

    const signedUrl = (await bucket.file(newImageBucketPath).getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    })).toString();

    // imageName is uid
    await Promise.all([
      admin.auth().updateUser(uid, { photoURL: signedUrl }),
      db.collection(USERS_COLLECTION).doc(uid).update({ 
        photo_url: signedUrl,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      })
    ]);
  }

  // Clean up temp directory
  return fs.remove(tempLocalDir);
};