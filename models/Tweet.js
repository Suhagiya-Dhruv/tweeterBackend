const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const tweetSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
