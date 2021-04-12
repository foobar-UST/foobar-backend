const { body } = require('express-validator');

const insertDeviceTokenValidationRules = () => {
  return [
    body('token').exists().isString(),
  ];
};

const linkDeviceTokenValidationRules = () => {
  return [
    body('token').exists().isString(),
  ];
};

const unlinkDeviceTokenValidationRules = () => {
  return [
    body('token').exists().isString(),
  ];
};

module.exports = {
  insertDeviceTokenValidationRules,
  linkDeviceTokenValidationRules,
  unlinkDeviceTokenValidationRules
};