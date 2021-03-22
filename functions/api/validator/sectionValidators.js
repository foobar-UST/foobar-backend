const { body } = require("express-validator");
const { SectionState } = require("../../models/SectionState");

const updateSectionStateValidationRules = () => {
  return [
    body('section_id').exists().isString(),
    body('section_state').exists().isIn(Object.values(SectionState))
  ];
};

const applySectionDeliveryValidationRules = () => {
  return [
    body('section_id').exists().isString()
  ];
};

const cancelSectionDeliveryValidationRules = () => {
  return [
    body('section_id').exists().isString()
  ];
};

const updateSectionLocationValidationRules = () => {
  return [
    body('section_id').exists().isString(),
    body('latitude').exists().isFloat(),
    body('longitude').exists().isFloat()
  ];
};

module.exports = {
  updateSectionStateValidationRules,
  applySectionDeliveryValidationRules,
  cancelSectionDeliveryValidationRules,
  updateSectionLocationValidationRules
};
