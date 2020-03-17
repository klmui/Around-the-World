require('dotenv').config();

// Dependencies
var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),

    // Models
    User                = require("./models/user"),
    Collection          = require("./models/collection"),

    // Routes
    indexRoutes         = require("./routes/index"),
    collectionRoutes    = require("./routes/collections");

// DB Connection
var url = process.env.DATABASEURL || "mongodb://localhost/around_the_world";
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to DB!');
}).catch((err) => {
    console.log('Error:', err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// __dirname is the directory of this project
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration
app.use(require("express-session")({
    secret: "dsajffjealdfj",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // authenticate is from passportLocalMongoose 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Adds this middleware to each route. Passes user info
app.use(function(req, res, next){
    // Creates a variable called currentUser for every file
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next();
});

// Use route files
app.use('/', indexRoutes);
app.use('/collections', collectionRoutes);

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started");
});