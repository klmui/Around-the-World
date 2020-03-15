var express = require("express");
var router  = express.Router();
var Collection = require("../models/collection");

// INDEX - Show all collections
router.get("/collections", function(req, res) {
    // Get all collections from DB

    res.render("collections");
});

// NEW - show form to create a new collection
router.get("/collections/new", function(req, res){
    res.render("collections/new");
});

module.exports = router;