const Seller = require("../../models/Seller");
const { sendSuccessResponse } = require("../responses/sendResponse");

const searchSellers = async (req, res) => {
  const searchQuery = req.query.query;

  const searchPromises = [
    Seller.searchBasic('name', searchQuery),
    Seller.searchBasic('name_zh', searchQuery)
  ];

  // Merge result lists and remove duplicated items
  const [results, resultsZh] = await Promise.all(searchPromises);
  const mergedResult = results.concat(resultsZh);

  return sendSuccessResponse(res, mergedResult);
};

module.exports = {
  searchSellers
}