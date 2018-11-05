const request = require('request');

const optionsAPI = {
  server: 'http://localhost:3000'
}
if (process.env.NODE_ENV === 'production'){
  optionsAPI.server = 'https://secure-cove-55972.herokuapp.com/';
}

/* GET 'home' page */
const homelist = function(req, res, next){
  const path = '/api/locations';
  const requestOptions = {
    url: optionsAPI.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: 77.135590,
      lat: 28.68840,
      maxDistance: 2999
    }
  };
  request(
    requestOptions,
    (error, response, body) => {
      let data = body;
      if (response.statusCode == 200 && data.length){
        for(let i = 0; i < data.length; i++){
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      _renderHomepage(req, res, data);
    }
  );
};

/* GET 'Location info' page */
const locationInfo = function(req, res, next){
  _getLocationInfo(req, res, _renderDetailPage);
};

/* GET 'Add review' page */
const addReview = function (req, res, next){
  _getLocationInfo(req, res,  _renderReviewForm);
};

const doAddReview = function(req, res, next){
  const locationid = req.params.locationid;
  const path = `/api/locations/${locationid}/reviews`;
  const postdata = {
    'author': req.body.name,
    "rating": parseInt(req.body.rating),
    reviewText: req.body.review
  };
  const requestOptions = {
    uri: optionsAPI.server + path,
    method: 'POST',
    json: postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText){
    res.redirect(`/location/${locationid}/review/new?err=val`);
  }else {
    request(requestOptions, (error, response, body) => {
      if (response.statusCode === 201){
        res.redirect(`/location/${locationid}`);
      }else if(response.statusCode === 400 && body.name && body.name === 'ValidationError'){
        res.redirect(`/location/${locationid}/review/new?err=val`);
      }else {
        _showError(req, res, response.statusCode);
      }
    });
  }
};

// PRIVATE HELPER METHODS
const _renderHomepage = function(req, res, responseBody){
  let message = null;
  if (!(responseBody instanceof Array)){
    message = 'API lookup error';
    responseBody = [];
  } else if (!responseBody.length){
      message = 'No places found nearby';
  }
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work with when out and about. Perhaps with coffee, cake or a pint? let Loc8r help you find the place you're looking for.",
    locations: responseBody,
    message: message
  });
};

const _formatDistance = function(distance){
  let thisDistance, unit = 'm';
  if (distance > 1000){
    thisDistance = (distance / 1000).toFixed(1);
    unit = 'km';
  } else {
    thisDistance = Math.floor(distance);
  }
  return thisDistance + unit;
};

const _renderDetailPage = function(req, res, locDetail){
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: "If you've been and you like it - or if you don't - please leave a review"
    },
    location: locDetail
  });
};

const _showError = function(req, res, status){
  let title = content = '';
  if (status === 404){
    title = '404, page not found';
    content = 'Oh dear. Looks like we can\'t find this page. Sorry.';
  }else {
    title = `${status}, something's gone wrong`;
    content = 'Something, somewhere, has gone just a little bit wrong';
  }
  res
    .status(status)
    .render('generic-text', {
      'title': title,
      'content': content
    });
};

const _renderReviewForm = function (req, res, locDetail){
  res.render("location-review-form", {
    title: `Review ${locDetail.name} on Loc8r`,
    pageHeader: {title: `Review ${locDetail.name}`},
    error: req.query.err
  });
};

const _getLocationInfo = function (req, res, callback){
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    uri: optionsAPI.server + path,
    method: 'GET',
    json: {}
  };
  request(requestOptions, (error, response, body)=>{
    let data = body;
    if (response.statusCode === 200){
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      };
      callback(req, res, data);
    }else {
      _showError(req, res, response.statusCode);
    }
  });
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
  doAddReview
};