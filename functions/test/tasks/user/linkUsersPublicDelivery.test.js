const { db, admin, clearDb } = require('../../../config.test');
const { delay } = require('../../utils/testUtils');
const { assert } = require('chai');

const testUserId = 'test_user';

const testUserDoc = {
  id: testUserId,
  username: 'testuser',
  email: 'testuser@test.com',
  name: 'Test User',
  phone_num: '12345678',
  photo_url: 'about:blank',
  updated_at: admin.firestore.Timestamp.now()
};

describe('Test delete: linkUsersPublicDelivery', async () => {
  before(async () => {
    // Create new user document.
    await db.doc(`users/${testUserId}`).set(testUserDoc);

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
  const testUserId = 'test_user';
  const newPhotoUrl = 'localhost:8080';

  before(async () => {
    // Create new user document.
    const testUserDoc = {
      id: testUserId,
      username: 'testuser',
      email: 'testuser@test.com',
      name: 'Test User',
      phone_num: '12345678',
      photo_url: 'about:blank',
      updated_at: admin.firestore.Timestamp.now()
    };

    await db.doc(`users/${testUserId}`).set(testUserDoc);

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
  const testUserId = 'test_user';

  before(async () => {
    // Create new user document.
    const testUserDoc = {
      id: testUserId,
      username: 'testuser',
      email: 'testuser@test.com',
      name: 'Test User',
      phone_num: '12345678',
      photo_url: 'about:blank',
      updated_at: admin.firestore.Timestamp.now()
    };

    await db.doc(`users/${testUserId}`).set(testUserDoc);

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



