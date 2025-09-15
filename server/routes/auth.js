const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { login, verifyOtp } = require('../controllers/authController');

dotenv.config();

// Reset password using token
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: 'Invalid or expired token' });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reset password' });
  }
});

// Request password reset link
router.post('/reset-password', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 10; // 10 min
    await user.save();

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendURL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // always send to admin email from .env
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password (valid 10 min):</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: 'Password reset link has been sent to your email.' });
  } catch (err) {
    console.error('SMTP email error:', err);
    res.status(500).json({ error: 'Failed to send reset link' });
  }
});

// Login and OTP
router.post('/login', login);
router.post('/verify-otp', verifyOtp);

module.exports = router;
