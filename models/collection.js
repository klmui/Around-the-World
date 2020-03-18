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
    zoom: { type: Number, default: 15 },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    // Changes Dynamically
    comments: [
      {
        // This is how we associate a comment with a collection
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    likes: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        username: String
      }
    ],
    pins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pin'
      }
    ]
  },
  {
    timestamps: true
  }
);

var Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
