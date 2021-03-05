const { query } = require("express-validator");

const searchSellersValidationRules = () => {
  return [
    query('query').exists().isString().notEmpty()
  ];
};

module.exports = {
  searchSellersValidationRules
}