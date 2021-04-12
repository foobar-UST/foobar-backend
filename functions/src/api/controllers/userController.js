const User = require("../../models/User");
const { sendSuccessResponse } = require("../responses/sendResponse");

const updateUserDetail = async (req, res) => {
  const userId = req.currentUser.uid;
  const newName = req.body.name;
  const newPhoneNum = req.body.phone_num;

  if (newName || newPhoneNum) {
    await User.updateUser(userId, {
      name: newName,
      phone_num: newPhoneNum
    });
  }

  return sendSuccessResponse(res);
};

module.exports = {
  updateUserDetail
}