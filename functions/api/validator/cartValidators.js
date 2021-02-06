const { body } = require('express-validator');

const addUserCartItemValidationRules = () => {
  return [
    body('item_id').exists().isString(),
    body('amounts').exists().isInt({ min: 1 }),
    body('section_id').optional().isString()
  ];
};

const updateUserCartItemValidationRules = () => {
  return [
    body('cart_item_id').exists().isString(),
    body('amounts').exists().isInt({ min: 0 })
  ];
};

module.exports = {
  addUserCartItemValidationRules,
  updateUserCartItemValidationRules
};