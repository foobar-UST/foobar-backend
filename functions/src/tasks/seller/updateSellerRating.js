const { db, admin } = require('../../../config');
const SellerType = require("../../models/SellerType");
const { SELLERS_COLLECTION } = require('../../../constants');

function getRatingsCountField(rating) {
  switch (rating) {
    case 1: return 'rating_count.poor';
    case 2: return 'rating_count.fair';
    case 3: return 'rating_count.good';
    case 4: return 'rating_count.very_good';
    case 5: return 'rating_count.excellent';
    default: throw new Error('Invalid rating.');
  }
}

function getTotalRatingsCount(ratingCount) {
  return [
    ratingCount.poor,
    ratingCount.fair,
    ratingCount.good,
    ratingCount.very_good,
    ratingCount.excellent
  ]
    .reduce((a, b) => a + b, 0);
}

module.exports = async function updateSellerRatingTask(change, context) {
  const prevRatingDetail = change.before.exists ? change.before.data() : null;
  const newRatingDetail = change.after.exists ? change.after.data() : null;
  const sellerId = context.params.sellerId;

  const sellerRef = db.doc(`${SELLERS_COLLECTION}/${sellerId}`);

  await db.runTransaction(async transaction => {
    const sellerDoc = await transaction.get(sellerRef);
    const updateData = {};

    /**
     * Number of ratings
     * Format:
     * {
     *   'excellent': 10,
     *   'very_good': 12,
     *   'good': 13,
     *   'fair': 9,
     *   'poor: 7
     * }
     */
    const oldTotalNumRatings = getTotalRatingsCount(sellerDoc.data().rating_count);

    // Return if there is no more rating left.
    if (!newRatingDetail && oldTotalNumRatings <= 0) {
      console.log('No rating left.');
      return true;
    }

    const newTotalNumRatings = (() => {
      // Rating document is modified
      if (prevRatingDetail && newRatingDetail) {
        return oldTotalNumRatings;
      }

      // Rating document is deleted
      if (prevRatingDetail && !newRatingDetail) {
        return oldTotalNumRatings - 1;
      }

      // Rating document is created
      if (!prevRatingDetail && newRatingDetail) {
        return oldTotalNumRatings + 1;
      }

      // Undefined condition
      return undefined;
    })();

    // Find the rating count field that need to be updated.
    const updateRatingCountField = newRatingDetail ?
      getRatingsCountField(newRatingDetail.order_rating) :
      getRatingsCountField(prevRatingDetail.order_rating);

    // Decide how to update the rating count field.
    const newRatingCountAction = (() => {
      if (prevRatingDetail && newRatingDetail) {
        return admin.firestore.FieldValue.increment(0);
      }

      if (newRatingDetail) {
        return admin.firestore.FieldValue.increment(1);
      }

      if (prevRatingDetail) {
        return admin.firestore.FieldValue.increment(-1);
      }

      return undefined;
    })();

    // Compute the new average order rating
    const oldOrderRating = sellerDoc.data().order_rating || 0;    // Use 0 if rating is undefined.
    const oldOrderRatingTotal = oldOrderRating * oldTotalNumRatings;

    const newOrderRating = (() => {
      // No more rating document left.
      if (newTotalNumRatings <= 0) {
        return 0;
      }

      // When the rating is modified.
      if (prevRatingDetail && newRatingDetail) {
        return (oldOrderRatingTotal - prevRatingDetail.order_rating + newRatingDetail.order_rating) / newTotalNumRatings;
      }

      // When a new rating is created.
      if (newRatingDetail) {
        return (oldOrderRatingTotal + newRatingDetail.order_rating) / newTotalNumRatings;
      }

      // When a rating is removed.
      if (prevRatingDetail) {
        return (oldOrderRatingTotal - prevRatingDetail.order_rating) / newTotalNumRatings;
      }

      return 0;
    })();

    Object.assign(updateData, {
      order_rating: newOrderRating,
      [updateRatingCountField]: newRatingCountAction
    });

    // Compute the new delivery rating percentage
    // When a new off-campus rating is added, calculate the satisfaction rate by summing up the total
    // number of thumbs up (TRUE) and divide it by the total number of rating records.
    // When a off-campus rating is removed, check if the satisfaction rate is positive, if yes,
    // decrement and divide, if not, simple divide it by the new number of rating records.
    // If there is no more ratings left, set delivery rating to zero.
    if (sellerDoc.data().type === SellerType.OFF_CAMPUS) {
      const oldDeliveryRating = sellerDoc.data().delivery_rating || 0;
      const oldDeliveryRatingTotal = oldDeliveryRating * oldTotalNumRatings;

      const newDeliveryRating = (() => {
        // No more rating document left.
        if (newTotalNumRatings <= 0) {
          return 0;
        }

        // When the rating is modified.
        if (prevRatingDetail && newRatingDetail) {
          // F & T
          if (!prevRatingDetail.delivery_rating && newRatingDetail.delivery_rating) {
            return (oldDeliveryRatingTotal + 1) / newTotalNumRatings;
          }

          // T & F
          if (prevRatingDetail.delivery_rating && !newRatingDetail.delivery_rating) {
            return (oldDeliveryRatingTotal - 1) / newTotalNumRatings;
          }

          // No change
          return oldDeliveryRating;
        }

        // When a new rating is created.
        if (newRatingDetail) {
          if (newRatingDetail.delivery_rating) {
            return (oldDeliveryRatingTotal + 1) / newTotalNumRatings;
          } else {
            return oldDeliveryRatingTotal / newTotalNumRatings;
          }
        }

        // When a rating is removed.
        if (prevRatingDetail) {
          if (prevRatingDetail.delivery_rating) {
            return (oldDeliveryRatingTotal - 1) / newTotalNumRatings;
          } else {
            return oldDeliveryRatingTotal / newTotalNumRatings;
          }
        }

        return 0;
      })();

      Object.assign(updateData, {
        delivery_rating: newDeliveryRating
      });
    }

    transaction.update(sellerRef, updateData);

    return Promise.resolve();
  });
};