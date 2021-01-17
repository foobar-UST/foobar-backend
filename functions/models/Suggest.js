const deleteCollection = require("../utils/deleteCollection");
const { USERS_COLLECTION } = require("../constants");
const { SUGGESTS_BASIC_COLLECTION } = require("../constants");

class Suggest {

  static async deleteAllBasic(userId) {
    await deleteCollection(`${USERS_COLLECTION}/${userId}/${SUGGESTS_BASIC_COLLECTION}`);
  }
}

module.exports = Suggest;
