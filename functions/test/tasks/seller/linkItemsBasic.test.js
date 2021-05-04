const { db, clearDb } = require('../../../config.test');
const { delay } = require('../../utils/testUtils');
const { assert } = require('chai');
const { fakeSeller, fakeItem } = require('../../utils/testFakes');

const testSeller = fakeSeller;
const testItem = fakeItem(testSeller.id);

describe('Test delete: linkItemsBasic', async () => {
  before(async () => {
    // Create a new seller
    await db.doc(`sellers/${testSeller.id}`).set(testSeller);

    // Create a new item
    await db.doc(`sellers/${testSeller.id}/items/${testItem.id}`).set(testItem);

    // Delete the item
    await db.doc(`sellers/${testSeller.id}/items/${testItem.id}`).delete();
    await delay(3000);
  });

  after(async () => {
    await clearDb();
  });

  it('should deleted items doc', async () => {
    const document = await db.doc(`sellers/${testSeller.id}/items_basic/${testItem.id}`).get();
    assert.isUndefined(document.data());
  });
});

describe('Test update: linkItemsBasic', async () => {
  const newTitle = 'New Title';
  let prevItemBasic;

  before(async () => {
    // Create a new seller
    await db.doc(`sellers/${testSeller.id}`).set(testSeller);

    // Create a new item
    await db.doc(`sellers/${testSeller.id}/items/${testItem.id}`).set(testItem);

    // Update the item
    await db.doc(`sellers/${testSeller.id}/items/${testItem.id}`).update({ title: newTitle });
    await delay(3000);

    prevItemBasic = (await db.doc(`sellers/${testSeller.id}/items_basic/${testItem.id}`).get()).data();
  });

  after(async () => {
    await clearDb();
  });

  it('should updated items doc', async () => {
    const document = await db.doc(`sellers/${testSeller.id}/items_basic/${testItem.id}`).get();
    const expected = {  ...prevItemBasic, title: newTitle };
    assert.deepEqual(document.data(), expected);
  });
});

describe('Test created: linkItemsBasic', async () => {
  before(async () => {
    // Create a new seller
    await db.doc(`sellers/${testSeller.id}`).set(testSeller);

    // Create a new item
    await db.doc(`sellers/${testSeller.id}/items/${testItem.id}`).set(testItem);
    await delay(3000);
  });

  after(async () => {
    await clearDb();
  });

  it('should created items doc', async () => {
    const document = await db.doc(`sellers/${testSeller.id}/items_basic/${testItem.id}`).get();
    const expected = {
      id: testItem.id,
      title: testItem.title,
      title_zh: testItem.title_zh,
      catalog_id: testItem.catalog_id,
      price: testItem.price,
      image_url: testItem.image_url,
      count: testItem.count,
      available: testItem.available
    };

    assert.deepEqual(document.data(), expected);
  });
});