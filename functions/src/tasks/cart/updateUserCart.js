const Seller = require('../../models/Seller');
const UserCart = require('../../models/UserCart');
const SellerSection = require('../../models/SellerSection');
const { get12HourString, getShortDateString } = require('../../utils/DateUtils');

const generateCartTitle = (sellerDetail, sectionDetail) => {
  if (!sectionDetail) {
    // Title for on-campus
    return sellerDetail.name;
  } else {
    // Title for off-campus
    const deliveryDate = getShortDateString(sectionDetail.delivery_time.toDate());
    const deliveryTime = get12HourString(sectionDetail.delivery_time.toDate());

    console.log(deliveryDate)

    return `(${deliveryDate} @ ${deliveryTime}) ${sectionDetail.title}`;
  }
};

const generateCartTitleZh = (sellerDetail, sectionDetail) => {
  return sectionDetail ? sectionDetail.title_zh : sellerDetail.name_zh;
};

const computeSubtotal = itemsRemain => {
  const itemsPrices = itemsRemain.map(cartItem => cartItem.total_price);
  return itemsPrices.reduce((sum, total_price) => sum + total_price);
};

module.exports = async function updateUserCartTask(change, context) {
  const userId            = context.params.userId;

  // Get all existing cart items
  const itemsSnapshot     = await change.after.ref.parent.get();
  const itemsRemain       = itemsSnapshot.docs.map(doc => doc.data());
  const itemsRemainCount  = itemsRemain.length;

  // Remove cart document when there is no more item in cart
  if (itemsRemainCount <= 0) {
    return await UserCart.deleteFor(userId);
  }

  const sellerId          = itemsRemain[0].item_seller_id;
  const sectionId         = itemsRemain[0].item_section_id;

  const sellerDetail      = await Seller.getDetail(sellerId);
  const sectionDetail     = sectionId ? await SellerSection.getDetail(sectionId) : null;

  const cartTitle         = generateCartTitle(sellerDetail, sectionDetail);
  const cartTitleZh       = generateCartTitleZh(sellerDetail, sectionDetail);
  const cartImageUrl      = sectionDetail ? sectionDetail.image_url : sellerDetail.image_url;
  const pickupLocation    = sectionDetail ? sectionDetail.delivery_location : sellerDetail.location;
  const deliveryTime      = sectionDetail ? sectionDetail.delivery_time : null;
  const sectionTitle      = sectionDetail ? sectionDetail.title : null;
  const sectionTitleZh    = sectionDetail ? sectionDetail.title_zh : null;

  // Order costs
  const subtotalCost      = computeSubtotal(itemsRemain);
  const deliveryCost      = sectionDetail ? sectionDetail.delivery_cost : 0;
  const totalCost         = deliveryCost + subtotalCost;

  return await UserCart.upsert(userId, {
    user_id:              userId,
    title:                cartTitle,
    title_zh:             cartTitleZh,
    seller_id:            sellerId,
    seller_name:          sellerDetail.name,
    seller_name_zh:       sellerDetail.name_zh,
    seller_type:          sellerDetail.type,
    section_id:           sectionId,
    section_title:        sectionTitle,
    section_title_zh:     sectionTitleZh,
    delivery_time:        deliveryTime,
    image_url:            cartImageUrl,
    pickup_location:      pickupLocation,
    items_count:          itemsRemainCount,
    delivery_cost:        deliveryCost,
    subtotal_cost:        subtotalCost,
    total_cost:           totalCost
  });
}