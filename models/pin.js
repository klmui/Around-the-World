var mongoose = require('mongoose');

var PinSchema = new mongoose.Schema({
  description: String,
  location: String,
  lng: Number,
  lat: Number
});

var Pin = mongoose.model('Pin', PinSchema);
module.exports = Pin;
