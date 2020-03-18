var mongoose = require('mongoose');

// Schema Setup
var collectionSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Middle of Nowhere' },
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    type: String,
    category: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String
    },
    // Changes Dynamically
    comments: [
      {
        // This is how we associate a comment with a collection
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    likes: {
      type: Number,
      default: 0
    },
    pins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pin"
        }
    ]
  },
  {
    timestamps: true
  }
);

var Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;