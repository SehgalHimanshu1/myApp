const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations.js');
const ctrlReviews = require('../controllers/reviews.js');

//locations
router
  .route('/locations')
  .get(ctrlLocations.locationsListByDistance)
  .post(ctrlLocations.locationsCreate);

router
  .route('/locations/:locationid')
  .get(ctrlLocations.locationsReadOne)
  .put(ctrlLocations.locationsUpdateOne)
  .delete(ctrlLocations.locationsDeleteOne);

//reviews
router.post("/locations/:locationid/reviews", ctrlReviews.reviewsCreate);

router
  .route("/locations/:locationid/reviews/:reviewid")
  .get(ctrlReviews.reviewsReadOne)
  .put(ctrlReviews.reviewsUpdateOne)
  .delete(ctrlReviews.reviewsDeleteOne);

module.exports = router;
