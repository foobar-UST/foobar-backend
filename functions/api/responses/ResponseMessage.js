module.exports = {
  VERIFY_ID_TOKEN_INVALID_TOKEN:                        'Invalid id token.',
  VERIFY_ID_TOKEN_MISSING_TOKEN:                        'Failed to receive id token.',

  VERIFY_FCM_TOKEN_INVALID_TOKEN:                       'Invalid fcm token.',
  VERIFY_FCM_TOKEN_MISSING_TOKEN:                       'Failed to receive fcm token,',

  VERIFY_ROLE_INVALID_ROLE:                             'Invalid user role.',

  INVALID_REQUEST_PARAMS:                               'Invalid request params.',

  // Cart routes
  ADD_USER_CART_ITEM_SELLER_OFFLINE:                    'Seller is currently offline.',
  ADD_USER_CART_ITEM_INVALID_SELLER_ERROR:              'Can only add item from one seller.',
  ADD_USER_CART_ITEM_INVALID_SECTION_ERROR:             'Can only add item from one section.',
  ADD_USER_CART_ITEM_MULTIPLE_ORDERS_ERROR:             'Cannot create more than one group order from the same section.',
  ADD_USER_CART_ITEM_SOLD_OUT_ERROR:                    'Item is sold out.',
  ADD_USER_CART_SECTION_UNAVAILABLE:                    'Section is unavailable.',
  REDUCE_USER_CART_ITEM_NOT_FOUND:                      'Failed to find cart item.',
  SYNC_USER_CART_UP_TO_DATE:                            'Cart items are up-to-date.',

  // Order routes
  ORDER_ADD_NEW_ORDER_PROFILE_NOT_COMPLETED:            'User profile is not completed.',
  ORDER_ADD_NEW_ORDER_NO_CART_ITEM:                     'No item in cart.',
  ORDER_ADD_NEW_ORDER_CART_NEED_SYNC:                   'Cart is not synchronized.',
  ORDER_ADD_NEW_ORDER_LESS_THAN_MIN_SPEND:              'Cost of the order is less than the minimum spend requirement.',
  ORDER_ADD_NEW_ORDER_UNAVAILABLE_ITEM:                 'Cart contains unavailable items.',
  ORDER_ADD_NEW_ORDER_SELLER_OFFLINE:                   'Seller is offline.',
  ORDER_ADD_NEW_ORDER_SECTION_UNAVAILABLE:              'Section is unavailable.',
  ORDER_ADD_NEW_ORDER_SECTION_FULL:                     'Section is full.',

  ORDER_CANCEL_ORDER_SELLER_OFFLINE:                    'Seller is offline.',
  ORDER_CANCEL_ORDER_INVALID_STATE:                     'Failed to cancel order.',

  UPDATE_ORDER_STATE_INVALID_STATE:                     'Invalid order state.',

  CONFIRM_ORDER_DELIVERED_NOT_SHIPPED:                  'Section is not in transit',
  CONFIRM_ORDER_DELIVERED_INVALID_DELIVERER:            'Invalid permission',

  // Section routes
  APPLY_SECTION_DELIVERY_EXISTING_DELIVERY:             'Failed to apply for more than one delivery.',
  APPLY_SECTION_DELIVERY_INVALID_PROFILE:               'Incomplete user profile.',
  CANCEL_SECTION_DELIVERY_NO_EXISTING_DELIVERY:         'No ongoing delivery.',
  UPDATE_SECTION_LOCATION_INVALID_DELIVERER:            'Invalid permission.',
  START_SECTION_DELIVERY_INVALID_DELIVERER:             'Invalid permission.',

  // Rating
  RATE_ORDER_INVALID_USER:                              'Invalid user.',
  RATE_ORDER_INVALID_ORDER_STATE:                       'Invalid order state.',
  RATE_ORDER_INVALID_RATING:                            'Invalid rating.',

  // Auth
  CHECK_DELIVERER_VERIFIED_NO_SELLER:                   'No restaurant found.'
};