const DeviceToken = require("../../models/DeviceToken");
const { sendSuccessResponse } = require("../responses/sendResponse");
const { admin } = require('../../../config');

// call from onNewIntent(),
const insertDeviceToken = async (req, res) => {
  const deviceToken = req.fcmToken;

  await DeviceToken.create({
    token: deviceToken
  });

  return sendSuccessResponse(res);
};

const linkDeviceTokenToUser = async (req, res) => {
  const userId = req.currentUser.uid;
  const deviceToken = req.fcmToken;

  // Check if the token document already existed.
  // If there is an existing token document, update the user id.
  // If not, create a new token document.
  const results = await DeviceToken.getBy('token', deviceToken);
  const tokenId = results[0] ? results[0].id : null;

  if (tokenId) {
    await DeviceToken.update(tokenId, {
      user_id: userId
    });
  } else {
    await DeviceToken.create({
      token: deviceToken,
      user_id: userId
    });
  }

  return sendSuccessResponse(res);
};

const unlinkDeviceTokenFromUser = async (req, res) => {
  const deviceToken = req.fcmToken;

  // Get the id of the token document we want to unlink.
  const results = await DeviceToken.getBy('token', deviceToken);
  const tokenId = results[0] ? results[0].id : null;

  if (tokenId) {
    await DeviceToken.update(tokenId, {
      user_id: admin.firestore.FieldValue.delete()
    });
  }

  return sendSuccessResponse(res);
};

module.exports = {
  insertDeviceToken,
  linkDeviceTokenToUser,
  unlinkDeviceTokenFromUser
};
