const DeviceToken = require("../../models/DeviceToken");
const sendNotifications = require('../../utils/sendNotifications');
const { generateLongDynamicLink } = require('../../utils/generateDynamicLink');
const AndroidNotificationChannels = require("../../utils/AndroidNotificationChannels");

module.exports = async function newAdvertiseNotifyUsersTask(change, context) {
  //const sellerId = context.params.sellerId;
  //const advertiseId = context.params.advertiseId;
  //const prevAdvertiseDetail = change.before.exists ? change.before.data() : null;
  const newAdvertiseDetail = change.after.exists ? change.after.data() : null;

  if (!newAdvertiseDetail) {
    return true;
  }

  const allDeviceTokensDocs = await DeviceToken.getAll();
  const allDeviceTokens = allDeviceTokensDocs.map(doc => doc.token);

  const dynamicLink = generateLongDynamicLink(
    `https://foobar-group-delivery-app.web.app/link/${newAdvertiseDetail.url}`
  );

  const body = `${newAdvertiseDetail.title} ${newAdvertiseDetail.title_zh}`;

  await sendNotifications(allDeviceTokens, {
    title_loc_key: 'notification_promotion_new_advertise_title',
    body_loc_key: 'notification_promotion_new_advertise_body',
    body_loc_args: `["${body}"]`,
    image: `${newAdvertiseDetail.image_url}`,
    android_channel_id: `${AndroidNotificationChannels.PROMOTION}`,
    link: `${dynamicLink}`
  });

  return true;
};