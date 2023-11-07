const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/authControllers');

router.post('/api/v1/auth/register', authControllers.register);

module.exports = router;