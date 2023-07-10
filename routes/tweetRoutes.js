const express = require('express');
const tweetController = require('../controllers/tweetController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware.verifyToken, tweetController.fetchTweet);
router.post('/', authMiddleware.verifyToken, tweetController.createTweet);
router.put('/:id', authMiddleware.verifyToken, tweetController.editTweet);
router.delete('/:id', authMiddleware.verifyToken, tweetController.deleteTweet);

module.exports = router;
