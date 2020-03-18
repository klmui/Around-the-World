var mongoose = require("mongoose");

var PinSchema = new mongoose.Schema({
  description: String,
  location: String,
  lng: Number,
  lat: Number
});

module.exports = mongoose.model("Pin", PinSchema);