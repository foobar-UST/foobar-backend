const { functions } = require('../../config');
const updateImageUrlTask = require('./storage/updateImageUrl');

// Update image url fields when a new image is uploaded.
exports.updateImageUrl = functions.runWith({ memory: '2GB', timeoutSeconds: 120 })
  .storage.object()
  .onFinalize(updateImageUrlTask);