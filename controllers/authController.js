const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(422).json({ error: 'Invalid data' });
      return;
    }

    const data = await User.findOne({ username });
    if (data) {
      res.status(409).json({ error: 'Username already exist' });
      return;
    }

    const user = new User({ username, password });
    await user.save();

    const token = jwt.sign({ userId: user.id, avatar: user.avatar, username: user.username }, config.jwtSecret);
    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {

    const { username, password } = req.body;
    if (!username || !password) {
      res.status(422).json({ error: 'Invalid data' });
      return;
    }

    const data = await User.findOne({ username, password });
    if (data == null) {
      res.status(404).json({ error: 'Username or password incorrect' });
      return;
    }

    const token = jwt.sign({ userId: data.id, avatar: data.avatar, username: data.username }, config.jwtSecret);

    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.username = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      res.status(422).json({ error: 'Invalid data' });
      return;
    }

    const data = await User.findOne({ username });
    if (data) {
      res.status(409).json({ error: 'Username already exist' });
      return;
    }

    res.json({ message: "Username available" });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};