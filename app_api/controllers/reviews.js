const mongoose = require('mongoose');
const Loc = mongoose.model("Location");

//EXPOSED METHODS
const reviewsCreate = function(req, res, next){
  const locationid = req.params.locationid;
  if (locationid){
    Loc
      .findById(locationid)
      .select('reviews')
      .exec((error, location) =>{
        if (error){
          res
            .status(400)
            .json(error);
        } else {
          _doAddReview(req, res, location);
        }
      });
  } else {
    res
      .status(404)
      .json({"message": "Not Found, locationid required"});
  }
};

const reviewsReadOne = function (req, res, next){
  if (req.params && req.params.locationid && req.params.reviewid){
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec((error, document) => {
        if (!document){
          res
            .status(404)
            .json({'message': 'locationid Not Found'});
          return;
        } else if (error){
          res
            .status(404)
            .json(error);
          return;
        }
        if (document.reviews && document.reviews.length > 0){
          const review = document.reviews.id(req.params.reviewid);
          if (!review){
            res
              .status(404)
              .json({"message": 'reviewid Not Found'});
          }else {
            const response = {
              location: {
                'name': document.name,
                '_id': req.params.locationid
              },
              review: review
            };
            res
              .status(200)
              .json(response);
          }
        } else {
          res
            .status(404)
            .json({"message": "No Reviews Found"});
        }
      });
  } else {
    res
      .status(404)
      .json({"message": 'Not Found, locationid and reviewid are both required'});
  }
};

const reviewsUpdateOne = function (req, res, next){
  if (!req.params.locationid && !req.params.reviewid){
    res
      .status(404)
      .json({"message": 'Not Found, locationid and reviewid both required'});
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec((error, location) => {
      if (!location){
        res
          .status(404)
          .json({'message': 'locationid not found'});
        return;
      }else if (error){
        res
          .status(400)
          .json(error);
        return;
      }
      if (location.reviews && location.reviews.length > 0){
        const thisReview = location.reviews.id(req.params.reviewid);
        if (!thisReview){
          res
            .status(404)
            .json({'message': 'reviewid Not Found'});
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save((error, location) => {
            if (error){
              res
                .status(404)
                .json(error);
            } else {
              _updateAverageRating(location._id);
              res
                .status(200)
                .json(thisReview);
            }
          });
        }
      }else{
        res
          .status(404)
          .json({message: "No review to update"});
      }
    });
};

const reviewsDeleteOne = function (req, res, next){
  if (!req.params.locationid && !req.params.reviewid){
    res
      .status(404)
      .json({"message": 'Not Found, reviewid and locationid are both required'});
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec((error, location) => {
      if (!location){
        res
          .status(404)
          .json({"message": "locationid Not found"});
        return;
      }else if(error){
        res
          .status(400)
          .json(error);
        return;
      }
      if (location.reviews && location.reviews.length > 0){
        if (!location.reviews.id(req.params.reviewid)){
          res
            .status(404)
            .json({"message": "reviewid Not found"});
        }else {
          location.reviews.id(req.params.reviewid).remove();
          location.save(error => {
            if (error){
              res
                .status(404)
                .json(error);
            }else {
              _updateAverageRating(location._id);
              res
                .status(204)
                .json(null);
            }
          });
        }
      } else {
        res
          .status(404)
          .json({"message": "No review to delete"});
      }
    });
};

//PRIVATE HELPER METHODS
const _doAddReview = function(req, res, location){
  if (!location){
    res
      .status(404)
      .json({"message": "locationid Not Found"});
  }else {
    location.reviews.push({
      'author': req.body.author,
      'rating': req.body.rating,
      "reviewText": req.body.reviewText
    });
    location.save((error, location)=>{
      if (error){
        res
          .status(400)
          .json(error);
      } else {
        _updateAverageRating(location._id);
        const thisReview = location.reviews[location.reviews.length -1];
        res
          .status(200)
          .json(thisReview);
      }
    });
  }
};

const _updateAverageRating = function (locationid){
  Loc
    .findById(locationid, 'rating reviews', (error, location)=>{
      if (!error){
        _doSetAverageRating(location);
      }
    });
};

const _doSetAverageRating = function (location){
  if (location.reviews && location.reviews.length > 0){
    const reviewCount = location.reviews.length;
    let ratingTotal = 0;
    for (let i = 0; i < reviewCount; i++){
      ratingTotal += location.reviews[i].rating;
    }
    const ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(error => {
      if (error){
        console.log('_doSetAverageRating: ', error);
      }else{
        console.log('_doSetAverageRating: rating set to ', ratingAverage);
      }
    });
  }
};

module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};
