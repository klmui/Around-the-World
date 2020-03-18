var express = require('express');
var router = express.Router({ mergeParams: true });
var Collection = require('../models/collection');
var Comment = require('../models/comment');
var middleware = require('../middleware/index.js');

// Comment - Create
router.post('/', middleware.isLoggedIn, function(req, res) {
  Collection.findById(req.params.id, function(err, collection) {
    if (err || !collection) {
      console.log(err);
      res.redirect('/collections');
    } else {
      req.body.comment.author = {
        id: req.user._id,
        username: req.user.username
      };
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          collection.comments.push(comment);
          collection.save();
          res.redirect('/collections/' + collection._id);
        }
      });
    }
  });
});

// Comment - Edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(
  req,
  res
) {
  Collection.findById(req.params.id, function(err, collection) {
    if (err || !collection) {
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', {
          collection_id: req.params.id,
          comment: comment
        });
      }
    });
  });
});

// Comment - Update
router.put('/:comment_id', middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err
  ) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/collections/' + req.params.id);
    }
  });
});

// Comment - Destroy
router.delete('/:comment_id', middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/collections/' + req.params.id);
    }
  });
});

module.exports = router;
