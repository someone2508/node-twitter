const express = require('express');
const router = express.Router();

const middleware = require('../middleware/authMiddleware');
const authControllers = require('../controllers/authControllers');

router.post('/api/v1/auth/register', authControllers.register);

router.post('/api/v1/auth/login', authControllers.login);

module.exports = router;