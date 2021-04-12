const { admin } = require('../../../config');
const SellerSection = require('../../models/SellerSection');
const sectionsData = require('../sample/seller_sections_fake_data.json');
const moment = require('moment-timezone');

function parseDate(input) {
  const inputDate = moment(input, 'YYYY-MM-DD HH:mm')
    .tz('Asia/Hong_Kong')
    .toDate();
  const currentDate = new Date();

  // Use input hours and minutes.
  currentDate.setHours(inputDate.getHours());
  currentDate.setMinutes(inputDate.getMinutes());

  return currentDate;
}

module.exports = async function insertSectionsFakeDataTask(context) {
  const section = sectionsData[0];

  await SellerSection.createDetail(section.seller_id, section.id, {
    id: section.id,
    title: section.title,
    title_zh: section.title_zh,
    group_id: section.group_id,
    seller_id: section.seller_id,
    seller_name: section.seller_name,
    seller_name_zh: section.seller_name_zh,
    delivery_cost: section.delivery_cost,
    delivery_time: admin.firestore.Timestamp.fromDate(
      parseDate(section.delivery_time)
    ),
    delivery_location: {
      address: section.delivery_location.address,
      address_zh: section.delivery_location.address_zh,
      geopoint: new admin.firestore.GeoPoint(
        section.delivery_location.geopoint.lat,
        section.delivery_location.geopoint.long
      )
    },
    cutoff_time: admin.firestore.Timestamp.fromDate(
      parseDate(section.cutoff_time)
    ),
    description: section.description,
    description_zh: section.description_zh,
    max_users: section.max_users,
    image_url: section.image_url,
    state: section.state,
    available: section.available,
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  });

  return true;
};