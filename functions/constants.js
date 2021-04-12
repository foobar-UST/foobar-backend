module.exports = {
  SELLER_IMAGE_WIDTH:                     1280,
  SELLER_IMAGE_HEIGHT:                    720,
  USER_PHOTO_IMAGE_SIZE:                  200,
  SELLER_ITEM_IMAGE_WIDTH:                1280,
  SELLER_ITEM_IMAGE_HEIGHT:               720,
  SECTION_IMAGE_WIDTH:                    1280,
  SECTION_IMAGE_HEIGHT:                   720,
  ADVERTISE_IMAGE_WIDTH:                  1280,
  ADVERTISE_IMAGE_HEIGHT:                 720,
  ITEM_CATEGORY_IMAGE_WIDTH:              1280,
  ITEM_CATEGORY_IMAGE_HEIGHT:             720,

  USERS_COLLECTION:                       'users',
  USERS_DELIVERY_COLLECTION:              'users_delivery',
  USERS_PUBLIC_COLLECTION:                'users_public',

  USER_ROLES_USER:                        'user',
  USER_ROLES_SELLER:                      'seller',
  USER_ROLES_DELIVERER:                   'deliverer',

  USER_CARTS_COLLECTION:                  'user_carts',
  USER_CART_ITEMS_SUB_COLLECTION:         'cart_items',

  DEVICE_TOKENS_COLLECTION:               'device_tokens',

  SUGGESTS_BASIC_COLLECTION:              'suggests_basic',

  SELLERS_COLLECTION:                     'sellers',
  SELLERS_BASIC_COLLECTION:               'sellers_basic',

  SELLER_ITEMS_SUB_COLLECTION:            'items',
  SELLER_ITEMS_BASIC_SUB_COLLECTION:      'items_basic',

  SELLER_CATALOGS_SUB_COLLECTION:         'catalogs',

  SELLER_SECTIONS_SUB_COLLECTION:         'sections',
  SELLER_SECTIONS_BASIC_SUB_COLLECTION:   'sections_basic',

  SELLER_ADVERTISES_SUB_COLLECTION:       'advertises',
  ADVERTISES_BASIC_COLLECTION:            'advertises_basic',

  SELLER_RATINGS_SUB_COLLECTION:          'ratings',
  SELLER_RATINGS_BASIC_SUB_COLLECTION:    'ratings_basic',

  SELLER_SECTION_STATE_AVAILABLE:         '0_available',
  SELLER_SECTION_STATE_PROCESSING:        '1_processing',
  SELLER_SECTION_STATE_PREPARING:         '2_preparing',
  SELLER_SECTION_STATE_SHIPPED:           '3_shipped',
  SELLER_SECTION_STATE_READY_FOR_PICK_UP: '4_ready_for_pick_up',
  SELLER_SECTION_STATE_DELIVERED:         '5_delivered',

  ORDERS_COLLECTION:                      'orders',
  ORDERS_BASIC_COLLECTION:                'orders_basic',

  ORDER_STATE_PROCESSING:                 '0_processing',
  ORDER_STATE_PREPARING:                  '1_preparing',
  ORDER_STATE_IN_TRANSIT:                 '2_in_transit',
  ORDER_STATE_READY_FOR_PICK_UP:          '3_ready_for_pick_up',
  ORDER_STATE_DELIVERED:                  '4_delivered',
  ORDER_STATE_ARCHIVED:                   '5_archived',
  ORDER_STATE_CANCELLED:                  '6_cancelled',

  PAYMENT_METHOD_COD:                     'cash_on_delivery',

  BROADCAST_MESSAGES_COLLECTION:          'broadcast_messages',

  ITEM_CATEGORIES_COLLECTION:             'item_categories',

  TRAVEL_MODE_DRIVING:                    'driving',
  TRAVEL_MODE_WALKING:                    'walking',

  // Storage folders
  USER_PHOTOS_FOLDER:                     'user_photos',
  SELLER_IMAGES_FOLDER:                   'seller_images',
  SELLER_SECTION_IMAGES_FOLDER:           'section_images',
  ITEM_IMAGES_FOLDER:                     'item_images',
  ADVERTISE_IMAGES_FOLDER:                'advertise_images',
  ITEM_CATEGORIES_IMAGES_FOLDER:          'item_categories_images'
};