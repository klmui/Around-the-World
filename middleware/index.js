var middlewareObj = {};
var Collection = require('../models/collection');

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

middlewareObj.checkCollectionOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Collection.findById(req.params.id, function(err, collection) {
      if (err || !collection) {
        res.redirect('back');
      } else {
        if (collection.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to perform this action!');
    res.redirect('back');
  }
};

module.exports = middlewareObj;
