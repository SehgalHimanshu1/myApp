/* GET 'home' page */
const homelist = function(req, res, next){
  res.render('locations-list', {title: 'home'});
};

/* GET 'Location info' page */
const locationInfo = function(req, res, next){
  res.render('location-info', {title: 'Location info'});
};

/* GET 'Add review' page */
const addReview = function (req, res, next){
  res.render("location-review-form", {title: "Add Review"});
};

module.exports = {
  homelist,
  locationInfo,
  addReview
};