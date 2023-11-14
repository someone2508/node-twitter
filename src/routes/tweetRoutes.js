const express = require('express');
const router = express.Router();

const tweetController = require('../controllers/tweetControllers');
const middleware = require('../middleware/authMiddleware');

router.post('/api/v1/tweet', middleware.verifyToken, tweetController.addTweet);

router.delete('/api/v1/tweet', middleware.verifyToken, tweetController.deleteTweet);

router.post('/api/v1/tweet/like', middleware.verifyToken, tweetController.likeTweet);

router.post('/api/v1/tweet/unlike', middleware.verifyToken, tweetController.disLikeTweet);

router.post('/api/v1/tweet/retweet', middleware.verifyToken, tweetController.addReTweet);

router.delete('/api/v1/tweet/retweet', middleware.verifyToken, tweetController.deleteRetweet)

router.post('/api/v1/tweet/comment', middleware.verifyToken, tweetController.addComment);

router.delete('/api/v1/tweet/comment', middleware.verifyToken, tweetController.deleteComment);

module.exports = router;

