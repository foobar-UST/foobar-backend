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

  ORDER_CANCEL_ORDER_SELLER_OFFLINE:                    'Seller is offline.',
  ORDER_CANCEL_ORDER_NOT_PROCESSING:                    'Failed to cancel order.',

  UPDATE_ORDER_STATE_INVALID_STATE:                     'Invalid order state.'
};