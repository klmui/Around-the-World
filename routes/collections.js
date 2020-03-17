var express = require('express');
var router = express.Router();
var middleware = require('../middleware/index.js');
var Collection = require('../models/collection');

// INDEX - Show all collections
router.get('/', function(req, res) {
  // Get all collections from DB
  Collection.find({}, function(err, collections) {
    if (err) {
      console.log(err);
    } else {
      res.render('collections/index', { collections: collections });
    }
  });
});

// NEW - Show form to create a new collection
router.get('/new', function(req, res) {
  res.render('collections/new');
});

// CREATE - Add new collection to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var location = req.body.location;
  var newCollection = {
    name: name,
    image: image,
    price: price,
    description: desc,
    author: author,
    location: location
  };

  // Create new collection and save it to DB
  Collection.create(newCollection, function(err, newlyCreated) {
    if (err) {
      res.redirect('/collections');
    } else {
      res.redirect('/collections');
    }
  });
});

// SHOW - shows collection (map with pins)
router.get('/:id', function(req, res) {
  Collection.findById(req.params.id, function(err, collection) {
    if (err || !collection) {
      res.redirect('back');
    } else {
      res.render('collections/show', { collection: collection });
    }
  });
});

// EDIT - Show form to edit collection
router.get('/:id/edit', middleware.checkCollectionOwnership, function(
  req,
  res
) {
  Collection.findById(req.params.id, function(err, collection) {
    res.render('collections/edit', { collection: collection });
  });
});

module.exports = router;
