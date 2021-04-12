const { admin } = require('../../config');

const deleteStorageFile = async (filePath) => {
  const bucket = admin.storage().bucket();
  const file = bucket.file(filePath);
  const isFileExist = (await file.exists())[0];

  if (isFileExist) {
    await file.delete();
  }
};

module.exports = {
  deleteStorageFile
};