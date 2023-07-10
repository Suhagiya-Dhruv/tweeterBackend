const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { AvatarGenerator } = require('random-avatar-generator');
const generator = new AvatarGenerator();

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: generator.generateRandomAvatar
  },
  following: [{
    type: String,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
