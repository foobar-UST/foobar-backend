const { db, admin, clearDb } = require('../../../config.test');
const { delay, loop } = require('../../utils/testUtils');
const { assert } = require('chai');
const { v4: uuidv4 } = require('uuid');

// 1. Insert a few rating documents
// 2. Update user photo url
// 3. Check if all rating documents contain the updated photo url

describe('Test updateUserSyncRating', async () => {
  const testSellerId = uuidv4();
  const newPhotoUrl = 'localhost';

  before(async () => {
    const testRatingsCount = 5;

    // Create a new user document
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

    await db.doc(`users/${testUserId}`).set(testUserDoc);

    // Insert a few rating documents
    const batch = db.batch();
    loop(testRatingsCount) (() => {
      const docRef = db.collection(`sellers/${testSellerId}/ratings`).doc();

      batch.set(docRef, {
        id: docRef.id,
        username: testUserDoc.username,
        user_photo_url: testUserDoc.photo_url,
        order_id: uuidv4(),
        order_rating: 3.0,
        delivery_rating: true,
        comment: 'Nice!',
        created_at: admin.firestore.Timestamp.now()
      });
    });

    await batch.commit();

    // Update user photo url
    await db.doc(`users/${testUserId}`).update({
      photo_url: newPhotoUrl
    });

    await delay(3000);
  });


  it('should update user photo url in ratings', async () => {
    const snap = await db.collection(`sellers/${testSellerId}/ratings`).get();
    const results = snap.docs.map(doc => doc.data());
    const photoUrls = results.map(result => result.user_photo_url);

    console.log(photoUrls);

    assert.isTrue(photoUrls.every(url => url === newPhotoUrl));
  });
});