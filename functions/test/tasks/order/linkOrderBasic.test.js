const { db, clearDb } = require('../../../config.test');
const { delay } = require('../../utils/testUtils');
const { assert } = require('chai');
const { fakeUser, fakeOrder } = require('../../utils/testFakes');

const testOrder = fakeOrder(fakeUser.id);

describe('Test delete: linkOrderBasic', async () => {
  before(async () => {
    // Create a new order
    await db.doc(`orders/${testOrder.id}`).set(testOrder);

    // Delete the order
    await db.doc(`orders/${testOrder.id}`).delete();

    await delay(3000);
  });

  after(async () => {
    await clearDb();
  });

  it('should deleted orders_basic doc', async () => {
    const document = await db.doc(`orders_basic/${testOrder.id}`).get();
    assert.isUndefined(document.data());
  });
});

describe('Test update: linkOrderBasic', async () => {
  const newOrderTitle = 'New Order Title';
  let prevOrderBasic;

  before(async () => {
    // Create a new order
    await db.doc(`orders/${testOrder.id}`).set(testOrder);

    // Store the created order basic
    await delay(3000);
    prevOrderBasic = (await db.doc(`orders_basic/${testOrder.id}`).get()).data();

    // Update the order
    await db.doc(`orders/${testOrder.id}`).update({
      title: newOrderTitle
    });

    await delay(3000);
  });

  after(async () => {
    await clearDb();
  });

  it('should update orders_basic doc', async () => {
    const document = await db.doc(`orders_basic/${testOrder.id}`).get();
    const expected = { ...prevOrderBasic, title: newOrderTitle };
    assert.deepEqual(document.data(), expected);
  });
});

describe('Test created: linkOrderBasic', async () => {
  before(async () => {
    // Create a new order
    await db.doc(`orders/${testOrder.id}`).set(testOrder);
    await delay(3000);
  });

  after(async () => {
    await clearDb();
  });

  it('should created orders_basic doc', async () => {
    const document = await db.doc(`orders_basic/${testOrder.id}`).get();
    const expected = {
      id: testOrder.id,
      title: testOrder.title,
      title_zh: testOrder.title_zh,
      user_id: testOrder.user_id,
      seller_id: testOrder.seller_id,
      seller_name: testOrder.seller_name,
      seller_name_zh: testOrder.seller_name_zh,
      section_id: testOrder.section_id,
      identifier: testOrder.identifier,
      image_url: testOrder.image_url,
      type: testOrder.type,
      order_items_count: testOrder.order_items_count,
      state: testOrder.state,
      delivery_address: testOrder.delivery_location.address,
      delivery_address_zh: testOrder.delivery_location.address_zh,
      total_cost: testOrder.total_cost,
      created_at: testOrder.created_at,
      updated_at: testOrder.updated_at
    };

    assert.deepEqual(document.data(), expected);
  });
});