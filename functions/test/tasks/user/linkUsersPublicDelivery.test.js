const { db, clearDb } = require('../../../config.test');
const { delay } = require('../../utils/testUtils');
const { assert } = require('chai');
const { fakeUser } = require('../../utils/testFakes');

const testUserId = fakeUser.id;

describe('Test delete: linkUsersPublicDelivery', async () => {
  before(async () => {
    // Create new user document.
    await db.doc(`users/${testUserId}`).set(fakeUser);

    // Delete user document
    await db.doc(`users/${testUserId}`).delete();

    await delay(3000);
  });

  after(async () => {
    await clearDb();
  });

  it('should deleted users_delivery doc', async () => {
    const result = await db.doc(`users_delivery/${testUserId}`).get();
    const userDeliveryDoc = result.data();

    assert.isUndefined(userDeliveryDoc);
  });

  it('should deleted users_public doc', async () => {
    const result = await db.doc(`users_public/${testUserId}`).get();
    const userDeliveryDoc = result.data();
    
    assert.isUndefined(userDeliveryDoc);
  });
});

describe('Test update: linkUsersPublicDelivery', () => {
  const newPhotoUrl = 'localhost';

  before(async () => {
    // Create new user document.
    await db.doc(`users/${testUserId}`).set(fakeUser);

    // Update user document
    await db.doc(`users/${testUserId}`).update({
      photo_url: newPhotoUrl
    });

    await delay(3000);
  });

  after(async () => {
    await clearDb();
  });

  it('should updated users_delivery doc', async () => {
    const result = await db.doc(`users_delivery/${testUserId}`).get();
    const userDeliveryDoc = result.data();

    const expected = {
      id: testUserId,
      username: 'testuser',
      name: 'Test User',
      phone_num: '12345678',
      photo_url: newPhotoUrl
    };

    assert.deepEqual(expected, userDeliveryDoc);
  });

  it('should updated users_public doc', async () => {
    const result = await db.doc(`users_public/${testUserId}`).get();
    const userDeliveryDoc = result.data();

    const expected = {
      id: testUserId,
      username: 'testuser',
      photo_url: newPhotoUrl
    };

    assert.deepEqual(expected, userDeliveryDoc);
  });
});

describe('Test create: linkUsersPublicDelivery', () => {
  before(async () => {
    // Create new user document.
    await db.doc(`users/${testUserId}`).set(fakeUser);

    await delay(3000);
  });

  after(async () => {
    await clearDb();
  });

  it('should created users_delivery doc', async () => {
    const result = await db.doc(`users_delivery/${testUserId}`).get();
    const userDeliveryDoc = result.data();

    const expected = {
      id: testUserId,
      username: 'testuser',
      name: 'Test User',
      phone_num: '12345678',
      photo_url: 'about:blank'
    };

    assert.deepEqual(expected, userDeliveryDoc);
  });

  it('should created users_public doc', async () => {
    const result = await db.doc(`users_public/${testUserId}`).get();
    const userDeliveryDoc = result.data();

    const expected = {
      id: testUserId,
      username: 'testuser',
      photo_url: 'about:blank'
    };

    assert.deepEqual(expected, userDeliveryDoc);
  });
});



