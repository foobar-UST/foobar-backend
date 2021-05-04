const { ORDER_STATE_PROCESSING } = require('../../constants');
const { TRAVEL_MODE_DRIVING } = require('../../constants');
const { SELLER_SECTION_STATE_AVAILABLE } = require('../../constants');
const { admin } = require('../../config.test');
const { v4: uuidv4 } = require('uuid');

const fakeUser = {
  id: 'test_user',
  username: 'testuser',
  email: 'testuser@test.com',
  name: 'Test User',
  phone_num: '12345678',
  photo_url: 'about:blank',
  updated_at: admin.firestore.Timestamp.now()
};

const fakeSeller = {
  id: 'kZr4pBjju7gQniYGS0kN',
  name: 'Foobarify',
  description: 'To inspire and nurture the human spirit – one person, one cup and one neighborhood at a time.',
  phone_num: '+852 1234-5678',
  location: {
    address: '',
    address_zh: '',
    geopoint: new admin.firestore.GeoPoint(22.340274775267353, 114.20176937394616)
  },
  image_url: 'https://media-cdn.tripadvisor.com/media/photo-s/11/fa/54/9c/cbd.jpg',
  min_spend: '0',
  order_rating: 0.0,
  delivery_rating: 0.0,
  rating_count: 0,
  type: 1,
  online: true,
  opening_hours: 'Sunday - Thursday 16:00 - 23:00\nFriday - Saturday 16:00 - 24:00\nPH : 16:00 - 23:00\nPH Eve : 16:00 - 24:00',
  tags: ['western', 'chinese', 'japanese'],
  by_user_id: fakeUser.id
};

const fakeSection = {
  id: '93d4c9b5-d6f6-430f-8e11-5af8ac93f24a',
  title: 'Lunch Order',
  title_zh: '午餐訂單',
  group_id: '64477299-cefb-4d0e-b6d1-c7a1603881cb',
  seller_id: fakeSeller.id,
  seller_name: fakeSeller.name,
  seller_name_zh: fakeSeller.name_zh,
  delivery_cost: 20.0,
  delivery_time: admin.firestore.Timestamp.now(),
  delivery_location: {
    address: 'Atrium, HKUST',
    address_zh: '中庭，香港科技大學',
    geopoint: new admin.firestore.GeoPoint(22.340274775267353, 114.20176937394616)
  },
  cutoff_time: admin.firestore.Timestamp.now(),
  description: 'Ordering food delivery for a group - whether for an office lunch or dinner at home—just got easier.',
  description_zh: '為團體訂購食物（無論是在家中辦公室午餐還是晚餐），都變得更加容易。',
  max_users: 20,
  joined_users_count: 0,
  joined_users_ids: [],
  image_url: 'https://www.wcity.com/images/fooddeliveryapps.jpg',
  state: SELLER_SECTION_STATE_AVAILABLE,
  available: true,
  updated_at: admin.firestore.Timestamp.now()
};

const fakeCartItem = {
  id: uuidv4(),
  user_id: fakeUser.id,
  item_id: 'dfbce3d8-399e-4f3e-ab30-f092dbe57223',
  item_seller_id: fakeSeller.id,
  item_section_id: fakeSection.id,
  item_title: 'Myer\'s Dark',
  item_price: 44,
  amounts: 2,
  total_price: 88,
  available: true,
  updated_at: admin.firestore.Timestamp.now()
};

const fakeOrder = userId => {
  return {
    id: uuidv4(),
    title: 'Fake Order',
    title_zh: 'Fake Order',
    user_id: userId,
    seller_id: uuidv4(),
    seller_name: 'Seller Name',
    seller_name_zh: 'Seller Name',
    section_id: uuidv4(),
    section_title: 'Section Title',
    section_title_zh: 'Section Title',
    deliverer_id: uuidv4(),
    deliverer_location: new admin.firestore.GeoPoint(22.340274775267353, 114.20176937394616),
    deliverer_travel_mode: TRAVEL_MODE_DRIVING,
    identifier: 'ABC123',
    image_url: 'about:blank',
    type: 1,
    order_items: [],
    order_items_count: 0,
    state: ORDER_STATE_PROCESSING,
    is_paid: true,
    payment_method: 'Payment Method',
    message: 'Message',
    delivery_location: {
      address: 'address',
      address_zh: 'address_zh',
      geopoint: new admin.firestore.GeoPoint(22.340274775267353, 114.20176937394616)
    },
    subtotal_cost: 50,
    delivery_cost: 30,
    total_cost: 80,
    verify_code: uuidv4(),
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  }
};

const fakeItem = sellerId => {
  return {
    id: uuidv4(),
    title: 'Cappuccino',
    title_zh: '意大利泡沫咖啡',
    description: 'description',
    description_zh: 'description_zh',
    catalog_id: '8bfc2dbb-390f-474e-bab6-ae897288d059',
    seller_id: sellerId,
    price: 20.5,
    image_url: 'about:blank',
    count: 50,
    available: true,
    updated_at: admin.firestore.Timestamp.now()
  };
};

module.exports = {
  fakeUser,
  fakeSeller,
  fakeSection,
  fakeCartItem,
  fakeOrder,
  fakeItem
};