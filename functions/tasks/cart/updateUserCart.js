const Seller = require("../../models/Seller");
const UserCart = require("../../models/UserCart");
const SellerSection = require("../../models/SellerSection");
const { get12HourString } = require("../../utils/DateUtils");
const { getShortDateString } = require("../../utils/DateUtils");

/**
 * Update 'user_carts' info when a cart item is modified in 'cart_items'.
 */
module.exports = async function updateUserCartTask(change, context) {
  const prevCartItem  = change.before.exists ? change.before.data() : null;
  const newCartItem   = change.after.exists ? change.after.data() : null;
  const userId        = context.params.userId;
  const cartData      = {};

  // Get all remaining cart items
  const itemsSnapshot     = await change.after.ref.parent.get();
  const itemsRemain       = itemsSnapshot.docs.map(doc => doc.data());
  const itemsRemainCount  = itemsRemain.length;

  // Remove cart document when there is no more item in cart
  if (itemsRemainCount <= 0) {
    return await UserCart.delete(userId);
  }

  const sellerId          = itemsRemain[0].item_seller_id;
  const sectionId         = itemsRemain[0].item_section_id;

  if (!prevCartItem && itemsRemainCount === 1) {
    // Fields to update when the first item is inserted in cart.
    console.log('[UpdateUserCart]: full update.');
    const [sellerDetail, sectionDetail] = await Promise.all([
      Seller.getDetail(sellerId),
      SellerSection.getDetail(sellerId, sectionId)
    ]);

    // isOffCampusSection ?
    const cartTitle         = sectionDetail ?
      `(${getShortDateString(sectionDetail.delivery_time.toDate())} @ ${get12HourString(sectionDetail.delivery_time.toDate())}) ${sectionDetail.title}` :
      sellerDetail.name;
    const cartTitleZh       = sectionDetail ? sectionDetail.title_zh : sellerDetail.name_zh;
    const cartImageUrl      = sectionDetail ? sectionDetail.image_url : sellerDetail.image_url;
    const sellerType        = sellerDetail.type;
    const pickupLocation    = sectionDetail ? sectionDetail.delivery_location : sellerDetail.location;
    const deliveryCost      = sectionDetail ? sectionDetail.delivery_cost : 0;
    const deliveryTime      = sectionDetail ? sectionDetail.delivery_time : null;

    Object.assign(cartData, {
      user_id:              userId,
      title:                cartTitle,
      title_zh:             cartTitleZh,
      seller_id:            sellerId,
      seller_type:          sellerType,
      section_id:           sectionId,
      delivery_time:        deliveryTime,
      image_url:            cartImageUrl,
      pickup_location:      pickupLocation,
      delivery_cost:        deliveryCost,
    });
  } else {
    // Fields to update when there are existing items in cart.
    console.log('[UpdateUserCart]: cost update.');
    const userCart          = await UserCart.get(userId);
    const deliveryCost      = userCart.delivery_cost;

    Object.assign(cartData, {
      delivery_cost:        deliveryCost
    });
  }

  const itemsPrices       = itemsRemain.map(cartItem => cartItem.total_price);
  const subtotalCost      = itemsPrices.reduce((sum, total_price) => sum + total_price);
  const totalCost         = cartData.delivery_cost + subtotalCost;

  Object.assign(cartData, {
    items_count:          itemsRemainCount,
    subtotal_cost:        subtotalCost,
    total_cost:           totalCost
  });

  return await UserCart.upsert(userId, cartData);
}