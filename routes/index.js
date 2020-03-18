var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", function(req,res){
    res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// Show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
}); 

// Handle sign up logic
router.post("/register", function(req, res){
    req.body.email = req.body.email.trim();
    var newUser = new User({
        username: req.body.username, 
        email: req.body.email
    });

    // Check if user with email already exists
    User.findOne({'email': req.body.email}, function(createNewUser, foundUser) {
        if (createNewUser) {
            User.register(newUser, req.body.password, function(err, user){
                if(err){
                    console.log(err);
                    return res.render("register", {error: err.message});
                }
                passport.authenticate("local")(req, res, function(){
                   req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
                   res.redirect("/collections"); 
                });
            });
        }
        else if (foundUser) {
            return res.render("register", {error: "User with email already exists"});
        }
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'}); // "error is the key from the flash"
});

// Handling login logic
router.post("/login", passport.authenticate("local",
 {
     successRedirect: "/collections",
     failureRedirect: "login",
     failureFlash: "Sorry! You couldn't login",
     successFlash: "Login, successful"
}), function(req, res){

});

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/collections");
});

module.exports = router;