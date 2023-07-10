// File: backend/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/follow', authMiddleware.verifyToken, userController.getFollowUser);
router.post('/:id/follow', authMiddleware.verifyToken, userController.followUser);
router.post('/:id/unfollow', authMiddleware.verifyToken, userController.unfollowUser);

module.exports = router;
