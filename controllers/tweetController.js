const Tweet = require('../models/Tweet');

exports.fetchTweet = async (_req, res) => {
  try {

    const tweet = await Tweet.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: 'id',
          as: 'author_data'
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $addFields: {
          username: {
            $arrayElemAt: ['$author_data.username', 0]
          },
          avatar: {
            $arrayElemAt: ['$author_data.avatar', 0]
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          content: 1,
          username: 1,
          avatar: 1,
          createdAt:1,
          author: 1
        }
      }
    ]);

    res.status(200).json({ message: 'Tweet successfully fetch', data: tweet });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.createTweet = async (req, res) => {
  try {
    const { content } = req.body;
    const { userId } = req.user;

    if (!content) {
      res.status(422).json({ message: 'Invalid data' });
      return;
    }

    const tweet = new Tweet({ content, author: userId });
    await tweet.save();

    res.status(201).json({ message: 'Tweet created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.editTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    if (!content) {
      res.status(422).json({ message: 'Invalid data' });
      return;
    }

    const data = await Tweet.findOne({ id }, { author: 1 });
    if (data.author !== userId) {
      res.status(409).json({ message: 'Author was not matching' });
      return;
    }

    await Tweet.updateOne({ id, author: userId }, { $set: { content } });
    res.json({ message: 'Tweet updated successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;

    await Tweet.deleteOne({ id });

    res.json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
