const { db, clearDb } = require('../../../config.test');
const { delay } = require('../../utils/testUtils');
const { assert } = require('chai');
const { fakeUser } = require('../../utils/testFakes');

// Insert a new section
// Insert a few order for that section
// When the order is created, check if the user is being added to the section.
// When the order is deleted or cancelled, check if the user is removed from the section.

describe('Test modifyOrderUpdateSection', async () => {
  before(async () => {

  });



});