var express = require('express');
var router = express.Router({ mergeParams: true });
var middleware = require('../middleware/index.js');
var Collection = require('../models/collection');
var NodeGeocoder = require('node-geocoder');
var Pin = require('../models/pin');

// Configurations for geocoder.
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);

// CREATE - Add pin to collection
router.post('/', middleware.isLoggedIn, function(req, res) {
  // Lookup collection
  Collection.findById(req.params.id, function(err, collection) {
    if (err || !collection) {
      console.log(err);
      res.redirect('/collections');
    } else {
      // Add geocoding data to collection.
      geocoder.geocode(req.body.pin.location, function(err, data) {
        if (err || !data.length) {
          console.log(err);
          return res.redirect('back');
        }
        req.body.pin.lat = data[0].latitude;
        req.body.pin.lng = data[0].longitude;
        req.body.pin.location = data[0].formattedAddress;

        // Create a new collection and save to DB
        Pin.create(req.body.pin, function(err, pin) {
          if (err) {
            console.log(err);
            res.redirect('/collections/' + req.params.id);
          } else {
            collection.pins.push(pin);
            collection.save();
            res.redirect('/collections/' + req.params.id);
          }
        });
      });
    }
  });
});

// UPDATE - Update collection in DB
router.put('/setZoom', middleware.checkCollectionOwnership, function(req, res) {
  Collection.findById(req.params.id, function(err, oldCollection) {
    oldCollection.zoom = req.body.pin.zoom;
    Collection.findByIdAndUpdate(req.params.id, oldCollection, function(
      err,
      newCollection
    ) {
      if (err) {
        console.log(err);
        res.render('/collections', { collection: newCollection });
      } else {
        console.log(newCollection);
        res.redirect('/collections/' + newCollection._id);
      }
    });
  });
});

module.exports = router;
