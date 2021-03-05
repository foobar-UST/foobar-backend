const sendNotifications = require('../../utils/sendNotifications');
const { generateLongDynamicLink } = require('../../utils/generateDynamicLink');
const DeviceToken = require("../../models/DeviceToken");
const AndroidNotificationChannels = require("../../utils/AndroidNotificationChannels");
const OrderState = require("../../models/OrderState");

module.exports = async function updateOrderNotifyUserTask(change, context) {
  //const orderId = context.params.orderId;
  const prevOrderDetail = change.before.data();
  const newOrderDetail = change.after.data();
  const userId = newOrderDetail.user_id;

  const prevOrderState = prevOrderDetail.state;
  const newOrderState = newOrderDetail.state;

  // Notify order state change only.
  if (prevOrderState === newOrderState) {
    return true;
  }

  // Ignore archived state.
  if (!newOrderState || newOrderState === OrderState.ARCHIVED) {
    return true;
  }

  // Get all the device tokens of the user.
  const deviceTokenDocs = await DeviceToken.getBy('user_id', userId);
  const deviceTokens = deviceTokenDocs.map(doc => doc.token);

  // Generate a dynamic link that will navigate to order detail page in the app.
  const dynamicLink = generateLongDynamicLink(
    `https://foobar-group-delivery-app.web.app/order/${newOrderDetail.id}`
  );

  let bodyLocKey;
  switch (newOrderState) {
    case OrderState.PROCESSING: bodyLocKey =
      'notification_order_update_state_body_processing'; break;
    case OrderState.PREPARING: bodyLocKey =
      'notification_order_update_state_body_preparing'; break;
    case OrderState.IN_TRANSIT: bodyLocKey =
      'notification_order_update_state_body_in_transit'; break;
    case OrderState.READY_FOR_PICK_UP: bodyLocKey =
      'notification_order_update_state_body_ready_for_pick_up'; break;
    case OrderState.DELIVERED: bodyLocKey =
      'notification_order_update_state_body_delivered'; break;
    case OrderState.CANCELLED: bodyLocKey =
      'notification_order_update_state_body_cancelled'; break;
    default: return true;
  }

  // Send notification through FCM
  await sendNotifications(deviceTokens, {
    title_loc_key: 'notification_order_update_state_title',
    title_loc_args: `["${newOrderDetail.identifier}"]`,
    body_loc_key: `${bodyLocKey}`,
    image: `${newOrderDetail.image_url}`,
    android_channel_id: `${AndroidNotificationChannels.ORDER}`,
    link: `${dynamicLink}`
  });

  return true;
};
