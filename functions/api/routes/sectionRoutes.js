const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const UserRole = require("../../models/UserRole");
const validateResult = require('../middlewares/validateResult');
const verifyRoles = require("../middlewares/verifyRoles");
const verifyIdToken = require("../middlewares/verifyIdToken");
const {
  updateSectionStateValidationRules,
  applySectionDeliveryValidationRules,
  cancelSectionDeliveryValidationRules,
  updateSectionLocationValidationRules,
  updateSectionTravelModeValidationRules
} = require('../validator/sectionValidators');

router.use(verifyIdToken);

// Seller: Update section state
router.post('/update',
  updateSectionStateValidationRules(), validateResult,
  verifyRoles([UserRole.USER, UserRole.SELLER]),
  sectionController.updateSectionState
);

// Deliverer: Apply for section delivery
router.post('/deliver',
  applySectionDeliveryValidationRules(), validateResult,
  verifyRoles([UserRole.USER, UserRole.DELIVERER]),
  sectionController.applySectionDelivery
);

// Deliverer: Cancel current section delivery
router.post('/cancel-delivery',
  cancelSectionDeliveryValidationRules(), validateResult,
  verifyRoles([UserRole.USER, UserRole.DELIVERER]),
  sectionController.cancelSectionDelivery
);

// Deliverer: Update section location
router.post('/location',
  updateSectionLocationValidationRules(), validateResult,
  verifyRoles([UserRole.USER, UserRole.DELIVERER]),
  sectionController.updateSectionLocation
);

module.exports = router