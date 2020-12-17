const functions = require('firebase-functions');
const updateImageUrlTask = require('./storage/updateImageUrl');

exports.updateImageUrl = functions.runWith({ memory: '2GB', timeoutSeconds: 120 })
  .storage.object()
  .onFinalize(updateImageUrlTask);