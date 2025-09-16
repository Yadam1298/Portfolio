const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const {
  login,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
} = require('../controllers/authController');

// OTP/login
router.post('/login', login);
router.post('/verify-otp', verifyOtp);

// Password reset
router.post('/reset-password', requestPasswordReset); // creates token and sends email
router.post('/reset-password/:token', resetPassword); // resets password with token

module.exports = router;
