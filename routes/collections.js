var express = require("express");
var router  = express.Router();
var Collection = require("../models/collection");

// INDEX - Show all collections
router.get("/collections", function(req, res) {
    // Get all collections from DB

    res.render("collections");
});

// NEW - Show form to create a new collection
router.get("/collections/new", function(req, res){
    res.render("collections/new");
});

// CREATE - Add new collection to DB
router.post("/collections", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var location = req.body.location;
    var newCollection = {name: name, image: image, price: price, description: desc, author: author, location: location};

    // TODO: Handle center and zoom of map

    // Create new collection and save it to DB
    Collection.create(newCollection, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to collectons page
            console.log(newlyCreated);
            res.redirect("/collections");
        }
    });
});

// SHOW - shows collection (map with pins)
router.get("/collections/:id", function(req, res) {
    // TODO
    res.render("collections/show");
});

module.exports = router;