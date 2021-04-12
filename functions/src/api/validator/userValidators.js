const { body } = require('express-validator');

const updateUserDetailValidationRules = () => {
  return [
    body('name').optional().isString(),
    body('phone_num').optional().isString()
  ];
};

module.exports = {
  updateUserDetailValidationRules
};