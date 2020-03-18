var express = require('express');
var router = express.Router();
var middleware = require('../middleware/index.js');
var Collection = require('../models/collection');
var NodeGeocoder = require('node-geocoder');

// Configurations for geocoder.
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);

// INDEX - Show all collections
router.get('/', function(req, res) {
  // Get all collections from DB and put most recent first
  Collection.find({})
    .sort({ updatedAt: -1 })
    .exec(function(err, collections) {
      if (err) {
        console.log(err);
      } else {
        res.render('collections/index', { collections: collections });
      }
    });
});

// Sort by date ascending
router.get('/date/asc', function(req, res) {
  // Get all collections from DB
  Collection.find({})
    .sort('updatedAt')
    .exec(function(err, collections) {
      if (err) {
        console.log(err);
      } else {
        res.render('collections/index', { collections: collections });
      }
    });
});

// Sort by name ascending
router.get('/name/asc', function(req, res) {
  // Get all collections from DB
  Collection.find({})
    .sort('name')
    .exec(function(err, collections) {
      if (err) {
        console.log(err);
      } else {
        res.render('collections/index', { collections: collections });
      }
    });
});

// Sort by price ascending
router.get('/price/asc', function(req, res) {
  // Get all collections from DB
  Collection.find({})
    .sort('price')
    .exec(function(err, collections) {
      if (err) {
        console.log(err);
      } else {
        res.render('collections/index', { collections: collections });
      }
    });
});

// Sort by price descending
router.get('/price/desc', function(req, res) {
  // Get all collections from DB
  Collection.find({})
    .sort({ price: -1 })
    .exec(function(err, collections) {
      if (err) {
        console.log(err);
      } else {
        res.render('collections/index', { collections: collections });
      }
    });
});

// Sort by likes descending
router.get('/likes/desc', function(req, res) {
  // Get all collections from DB
  Collection.find({})
    .sort({ likes: -1 })
    .exec(function(err, collections) {
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
  req.body.collection.author = {
    id: req.user._id,
    username: req.user.username
  };
  console.log(req.body.collection);

  // Add geocoding data to collection.
  geocoder.geocode(req.body.collection.location, function(err, data) {
    if (err || !data.length) {
      console.log(err);
      return res.redirect('back');
    }
    req.body.collection.lat = data[0].latitude;
    req.body.collection.lng = data[0].longitude;
    req.body.collection.location = data[0].formattedAddress;

    // Create a new collection and save to DB
    Collection.create(req.body.collection, function(err) {
      if (err) {
        console.log(err);
        res.redirect('/collections/new');
      } else {
        res.redirect('/collections');
      }
    });
  });
});

// SHOW - shows collection (map with pins)
router.get('/:id', function(req, res) {
  Collection.findById(req.params.id)
    .populate('comments pins')
    .exec(function(err, collection) {
      if (err || !collection) {
        console.log(err);
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

// UPDATE - Update collection in DB
router.put('/:id', middleware.checkCollectionOwnership, function(req, res) {
  Collection.findByIdAndUpdate(req.params.id, req.body.collection, function(
    err,
    collection
  ) {
    if (err) {
      console.log(err);
      res.render('/collections', { collection: collection });
    } else {
      console.log(collection);
      res.redirect('/collections/' + collection._id);
    }
  });
});

// Collection - Destroy
router.delete('/:id', middleware.checkCollectionOwnership, function(req, res) {
  Collection.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect('/collections');
    } else {
      res.redirect('/collections');
    }
  });
});

// Collection like route
router.post('/:id/like', middleware.isLoggedIn, function(req, res) {
  Collection.findById(req.params.id, function(err, foundCollection) {
    if (err) {
      console.log(err);
      return res.redirect('/collections/' + req.params.id);
    }

    // Check if req.user._id exists in foundCollection.likes
    // some iterates through likes and compares it with like until true
    var foundUserLike = foundCollection.likes.some(function(like) {
      return like.equals(req.user._id);
    });

    if (foundUserLike) {
      // Removing like
      foundCollection.likes.pull(req.user._id);
    } else {
      // Adding new like by pushing user
      foundCollection.likes.push(req.user);
    }

    foundCollection.save(function(err) {
      if (err) {
        console.log(err);
        return res.redirect('/collections');
      }
      return res.redirect('/collections');
    });
  });
});

module.exports = router;
