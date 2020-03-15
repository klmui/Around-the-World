var express = require("express");
var router  = express.Router();

// INDEX - Show all collections
router.get("/collections", function(req, res) {
    res.render("collections");
});

module.exports = router;