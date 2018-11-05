const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const locationsListByDistance = function (req, res, next){
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseFloat(req.query.maxDistance);

  if (!lng && lng!== 0 ||!lat && lat !== 0||!maxDistance){
    console.log('locationsListByDistance: missing params');
    res
      .status(404)
      .json({"message": "Not Found, lng, lat and maxDistance are all required"});
    return 0;
  }
  Loc.aggregate([{
    "$geoNear": {
      spherical: true,
      maxDistance: maxDistance,
      distanceField: 'distance',
      num: 10,
      near: {"type": "Point", "coordinates": [lng, lat]}
    }
  },{
    "$project": {
      reviews: 0,
      openingTimes: 0,
      coords: 0
    }
  }], (error, documents) => {
    if (error) {
      res.status(404).json(error);
      return 0;
    }
    res.status(200).json(documents);
  });
};

const locationsCreate = function (req, res, next){
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(','),
    "coords": [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      'days': req.body.days1,
      'opening': req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    },{
      'days': req.body.days2,
      'opening': req.body.opening2,
      'closing': req.body.closing2,
      closed: req.body.closed2
    }]
  },(error, document)=>{
    if (error){
      res
        .status(400)
        .json(error);
    } else {
      res
        .status(201)
        .json(document)
    }
  });
};

const locationsReadOne = function (req, res, next){
  if (req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
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
        res
          .status(200)
          .json(document);
      });
  } else {
    res
      .status(404)
      .json({'message': 'No locationid in request'});
  }
};

const locationsUpdateOne = function (req, res, next){
  if (!req.params.locationid){
    res
      .status(404)
      .json({"message": 'Not Found, locationid required'});
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec((error, location) => {
      if (!location){
        res
          .status(404)
          .json({"message": 'locationid not found'});
        return;
      }else if (error){
        res
          .status(400)
          .json(error);
        return 0;
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(',');
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1,
      },{
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2
      }];
      location.save((error, location) => {
        if (error){
          res
            .status(404)
            .json(error);
        }else {
          res
            .status(200)
            .json(location);
        }
      });
    });
};

const locationsDeleteOne = function (req, res, next){
  const locationid = req.params.locationid;
  if (locationid){
    Loc
      .findByIdAndRemove(locationid)
      .exec((error, location) => {
        if (error){
          res
            .status(404)
            .json(error);
        }else{
          res
            .status(204)
            .json(null);
        }
      });
  }else {
    res
      .status(404)
      .json({"message": 'No locationid'});
  }
};

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};
