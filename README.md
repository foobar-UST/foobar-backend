# foobar-backends
Foobar++ is a group ordering and delivery application.

## Dependencies
- To install required dependencies
```console
cd ./functions
npm install
```

## Endpoints
https://asia-east2-foobar-group-delivery-app.cloudfunctions.net
### Authorization
For all **Auth required** endpoints, insert the authorization header.

headers | type | description
---------- | -------------- | --------------
Authorization | string | use getIdToken() from Auth SDK

### Generic Response
##### Success
```json
{
    "data": {
      "field1": "data",
      "field2": "data"
    }
}
```
##### Error
```json
{
    "error": {
      "code":       "4xx",
      "message":    "Include error message here"
    }
}
```

### Add Cart Item
Endpoint for adding cart item for a user.  
**URL**: /api/cart  
**Method**: PUT  
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
item_id | string | the item to be added to cart
amounts | integer | how many items are added
section_id | string? | (optional) the section added from

### Update Cart Item
Endpoint for updating cart item for a user.  
**URL**: /api/cart  
**Method**: POST  
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
cart_item_id | string | the cart item to be updated
amounts | integer | the new amounts of the seller item

### Remove All Cart Items
Endpoint for removing all cart items for a user.  
**URL**: /api/cart  
**Method**: DELETE  
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
None |

### Sync Cart Items
Endpoint for synchronizing all cart items with the corresponding seller items for a user.  
**URL**: /api/cart/sync  
**Method**: POST  
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
None |

### Update User Profile
Endpoint for updating user profile.  
**URL**: /api/user  
**Method**: POST  
**Auth required**: YES  
#### Request
body | type | description
---------- | -------------- | --------------
name | String? | (Optional) the full name of the user
phone_num | String? | (Optional) the phone number of the user

### Search sellers
Endpoint for searching sellers.  
**URL**: /api/seller/search   
**Method**: GET   
**Auth required**: NO
#### Request
body | type | description
---------- | -------------- | --------------
query | String | search query

### Place Order
Endpoint for placing a new order.  
**URL**: /api/order  
**Method**: PUT  
**Auth required**: YES  
#### Request
body | type | description
---------- | -------------- | --------------
message | String? | (Optional) order notes for the seller
payment_method | String | payment method identifier (must be the ones included in the database)

### Cancel Order (User/Seller)
Endpoint for cancelling an order.  
**URL**: /api/order/cancel  
**Method**: POST  
**Auth required**: YES  
#### Request
body | type | description
---------- | -------------- | --------------
order_id | String | the id of the order

### Update Order State (Seller)
Endpoint for updating the order state.  
**URL**: /api/order/update  
**Method**: POST  
**Auth required**: YES  
#### Request
body | type | description
---------- | -------------- | --------------
order_id | String | the id of the order
order_state | String | the state of the order

### Confirm Order Delivered (Seller/Deliverer)
Endpoint for confirming an order is delivered to the customer.   
**URL**: /api/order/delivered   
**Method**: POST  
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
order_id | String | the id of the order

### Rate Order (User)
Endpoint for rating a delivered order.   
**URL**: /api/order/rate   
**Method**: POST  
**Auth required**: YES   
#### Request
body | type | description
---------- | -------------- | --------------
order_id | String | the id of the order
order_rating | Int | [0, 5]
delivery_rating | Boolean | (Optional) TRUE for thumb up, FALSE for thumb down

### Update Section State (Seller)
Endpoint for updating the state of a section.   
**URL**: /api/section/update   
**Method**: POST  
**Auth required**: YES   
#### Request
body | type | description
---------- | -------------- | --------------
section_id | String | the id of the section
section_state | String | the state of the section

### Apply for Section Delivery (Deliverer)
Endpoint for applying for a section delivery.   
**URL**: /api/section/deliver   
**Method**: POST  
**Auth required**: YES   
#### Request
body | type | description
---------- | -------------- | --------------
section_id | String | the id of the section
section_state | String | the updated state of the section

### Update Section Location (Deliverer)
Endpoint for updating a section's current location.   
**URL**: /api/section/location   
**Method**: POST  
**Auth required**: YES   
#### Request
body | type | description
---------- | -------------- | --------------
section_id | String | the id of the section
latitude | Float | the latitude of the current location
longitude | Float | the longitude of the current location

### Start orders pick up (Deliverer)
Endpoint for start orders pick up.   
**URL**: /api/section/pickup   
**Method**: POST  
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
section_id | String | the id of the section

## Functions
Functions | Usages
---------- | --------------
cart-updateUserCart | Update 'user_carts' info when a cart item is modified in 'cart_items'.
order-linkOrdersBasic | Link with 'orders_basic' collection.
order-updateOrderNotifyUser | Send notifications to users when the order state is changed.
order-modifyOrderUpdateSection | Update the section document when a new group order is modified.
promotion-randomizeAdvertiseBasics | Randomize 'advertise_basics' documents every day to ensure display fairness.
section-linkSectionsBasic | Link with 'sections_basic' sub-collection.
section-sectionUpdateRequireCartSync | Update user' cart info when a section is updated.
section-linkSectionStateToOrderState | Link section state to orders state.
section-linkSectionLocationToOrderLocation | Link section location to order location.
section-sectionUpdateOrderSync | Update orders when a section is updated.
section-deleteSectionResources | Delete section resources.
seller-linkSellersBasic | Link with 'seller_basic' collection.
seller-sellerUpdateRequireCartSync | Update user' cart info when a seller is updated.
seller-sellerUpdateOrderSync | Update orders when a seller is updated.
seller-deleteSellerResources | Delete seller resources.
seller-updateItemAvailability | Update items' available state based on their belonged catalog state.
seller-linkItemsBasic | Link with 'items_basic' sub-collection.
seller-itemUpdateRequireCartSync | Update user' cart info when a item is updated.
seller-deleteItemResources | Delete item resources.
seller-linkAdvertisesBasic | Link with 'advertises_basic' collection.
seller-newAdvertiseNotifyUsers | Send notification to all users when a new seller advertisement is created.
seller-updateSellerRating | Update seller average rating
seller-linkRatingsBasic | Link with 'ratings_basic' sub collection.
storage-updateImageUrl | Update image url fields when a new image is uploaded.
user-copyAuthToUsers | Create new user document when a new user account is created in Auth.
user-deleteUser | Clean up resources when a user is deleted.
user-linkUserCollections | Link with 'users_delivery' and 'users_public'.
user-updateUserSyncRating | Update user rating documents.


## Deploy
- To deploy all functions
```console
firebase deploy --only functions
```

- To deploy a specific group of functions
```console
firebase deploy --only functions:group_name
```

## Emulator
- To start emulator
```console
firebase emulators:start --import=./emulator --export-on-exit
```