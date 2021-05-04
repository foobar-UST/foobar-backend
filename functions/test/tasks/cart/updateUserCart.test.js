const { db, clearDb } = require('../../../config.test');
const { delay } = require('../../utils/testUtils');
const { assert } = require('chai');
const { fakeUser, fakeSeller, fakeSection, fakeCartItem } = require('../../utils/testFakes');
const { get12HourString, getShortDateString } = require('../../../src/utils/DateUtils');

describe('Test updateUserCart', async () => {
  before(async () => {
    // Insert user
    await db.doc(`users/${fakeUser.id}`).set(fakeUser);

    // Insert seller detail
    await db.doc(`sellers/${fakeSeller.id}`).set(fakeSeller);

    // Insert section detail
    await db.doc(`sellers/${fakeSeller.id}/sections/${fakeSection.id}`).set(fakeSection);

    // Insert a new cart item
    await db.doc(`users/${fakeUser.id}/cart_items/${fakeCartItem.id}`).set(fakeCartItem);

    await delay(5000);
  });

  afterEach(async () => {
    await clearDb();
  });

  // TODO: should updated user cart with on-campus data

  it('should updated user cart with off-campus data', async () => {
    const userCart = await db.doc(`user_carts/${fakeUser.id}`).get();

    const deliveryDate = getShortDateString(fakeSection.delivery_time.toDate());
    const deliveryTime = get12HourString(fakeSection.delivery_time.toDate());

    const { updated_at, ...result } = userCart.data();

    const expected = {
      user_id: fakeUser.id,
      title: `(${deliveryDate} @ ${deliveryTime}) ${fakeSection.title}`,
      title_zh: fakeSection.title_zh,
      seller_id: fakeSection.seller_id,
      seller_name: fakeSection.seller_name,
      seller_type: 1,
      section_id: fakeSection.id,
      section_title: fakeSection.title,
      section_title_zh: fakeSection.title_zh,
      delivery_time: fakeSection.delivery_time,
      image_url: fakeSection.image_url,
      pickup_location: fakeSection.delivery_location,
      items_count: 1,
      subtotal_cost: fakeCartItem.total_price,
      delivery_cost: fakeSection.delivery_cost,
      total_cost: fakeCartItem.total_price + fakeSection.delivery_cost
    };

    assert.deepEqual(result, expected);
  });
});