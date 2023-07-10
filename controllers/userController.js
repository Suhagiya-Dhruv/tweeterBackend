const User = require('../models/User');

exports.getFollowUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findOne({ id: userId }, { _id: 0, following: 1 });

    const promises = user.following.map(userId => {
      return new Promise(async (resolve, reject) => {
        const data = await User.findOne({ id: userId })
        const userData = { id: data.id, username: data.username, avatar: data.avatar };
        resolve(userData);
      });
    });

    Promise.all(promises)
      .then(userDataArray => {
        res.status(200).json({ message: 'Successfully fetch data', data: userDataArray })
      })
      .catch(error => {
        res.status(200).json({ message: error })
      });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const user = await User.findOne({ id: userId });

    if (user.following.includes(id)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    user.following.push(id);
    await user.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const user = await User.findOne({ id: userId });

    if (!user.following.includes(id)) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    user.following = user.following.filter((userId) => userId !== id);
    await user.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
