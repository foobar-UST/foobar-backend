module.exports = {
  USERS_COLLECTION:                       'users',
  USERS_DELIVERY_COLLECTION:              'users_delivery',
  USERS_PUBLIC_COLLECTION:                'users_public',

  USER_ROLES_USER:                        'user',
  USER_ROLES_DELIVERER:                   'deliverer',
  USER_ROLES_SELLER:                      'seller',

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

  SELLER_SECTION_STATE_AVAILABLE:         'available',
  SELLER_SECTION_STATE_PROCESSING:        'processing',
  SELLER_SECTION_STATE_PREPARING:         'preparing',
  SELLER_SECTION_STATE_SHIPPED:           'shipped',
  SELLER_SECTION_STATE_DELIVERED:         'delivered',

  ORDERS_COLLECTION:                      'orders',
  ORDERS_BASIC_COLLECTION:                'orders_basic',

  ORDER_LOCATIONS_COLLECTION:             'orders_location',

  ORDER_STATE_PROCESSING:                 'processing',
  ORDER_STATE_PREPARING:                  'preparing',
  ORDER_STATE_IN_TRANSIT:                 'in_transit',
  ORDER_STATE_READY_FOR_PICK_UP:          'ready_for_pickup',
  ORDER_STATE_DELIVERED:                  'delivered',
  ORDER_STATE_ARCHIVED:                   'archived',
  ORDER_STATE_CANCELLED:                  'cancelled',

  PAYMENT_METHOD_COD:                     'cash_on_delivery',

  BROADCAST_MESSAGES_COLLECTION:          'broadcast_messages',

  USER_PHOTOS_FOLDER:                     'user_photos',
  SELLER_IMAGES_FOLDER:                   'seller_images',
  ITEM_IMAGES_FOLDER:                     'item_images'
};