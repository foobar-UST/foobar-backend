# foobar-backends
Foobar++ is a group ordering and delivery application.

## Changelog
See all the changes here [CHANGELOG.md](CHANGELOG.md).

## Endpoints
https://us-central1-foobar-group-delivery-app.cloudfunctions.net
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

### Cancel Order (User)
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

### Update Order Location (Deliverer)
Endpoint for updating an order's current location.
**URL**: /api/order/deliver/location  
**Method**: POST  
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
order_id | String | the id of the order
latitude | Float | the latitude of the current location
longitude | Float | the longitude of the current location

### Confirm Order Delivered (Deliverer)
Endpoint for confirming an order is delivered to the customer.
**URL**: /api/order/deliver/confirm  
**Method**: POST  
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
order_id | String | the id of the order


## Functions
Functions | Usages
---------- | --------------
TODO: Documentation |


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

## Disable functions
- To disable functions, simply uncomment them and re-deploy again to Firebase.
