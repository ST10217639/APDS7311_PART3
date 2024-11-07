const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');
const loginLimiter = require('../middleware/rateLimitMiddleware');

router.post('/login', loginLimiter, loginUser);

module.exports = router;
