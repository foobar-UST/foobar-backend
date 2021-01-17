# foobar-backends
Foobar++ is a group ordering and delivery application.

## Changelog
See all the changes here [CHANGELOG.md](CHANGELOG.md).

## Endpoints
https://us-central1-foobar-group-delivery-app.cloudfunctions.net
#### Authorization
Insert authorization header for **Auth required** endpoints.
headers | type | description
---------- | -------------- | --------------
Authorization | string | use getIdToken() from Auth SDK

#### Generic Response
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



### Hello World
Endpoint for testing get request.
**URL**: /api/test/hello-world
**Method**: GET
**Auth required**: NO

#### Request
query | type | description
---------- | -------------- | --------------
has_error | boolean | Decide whether to receive a error response

#### Response
fields | type | description
---------- | -------------- | --------------
result | string | A text response showing 'Success! Hello World!'

### Add Cart Item
Endpoint for adding cart item for a user.
**URL**: /api/cart
**Method**: PUT
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
seller_id | string | the seller of the item
section_id | string? | the section of the item
item_id | string | the item to be added to cart
amounts | integer | how many items are added

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

### Remove Cart Items
Endpoint for removing all cart items for a user.
**URL**: /api/cart
**Method**: DELETE
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
None |

### Sync Cart Items
Endpoint for synchrozing all cart items with the corresponding seller items for a user.
**URL**: /api/cart/sync
**Method**: POST
**Auth required**: YES
#### Request
body | type | description
---------- | -------------- | --------------
None |


## Functions
Functions | Usages
---------- | --------------

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
- To disable functions, simply uncomment them and deploy again to Firebase.
