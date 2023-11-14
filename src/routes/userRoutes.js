const express = require('express');
const middleware = require('../middleware/authMiddleware');
const router = express.Router();
const controllers = require('../controllers/userControllers');

router.post('/api/v1/user/follow', middleware.verifyToken, controllers.follow);

router.post('/api/v1/user/unfollow', middleware.verifyToken, controllers.unfollow);

router.get('/api/v1/user/followers', middleware.verifyToken, controllers.getFollowers);

router.delete('/api/v1/user/me', middleware.verifyToken, controllers.deleteMe);

module.exports = router;