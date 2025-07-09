const express = require('express');
const router = express.Router();
const { login, verifyOtp } = require('../controllers/authController');

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const User = require('../models/User'); // adjust path

dotenv.config();

const bcrypt = require('bcrypt');

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

router.get('/reset-password', async (req, res) => {
  try {
    const email = process.env.EMAIL_USER;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'Admin user not found' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 10; // 10 min
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({
      message: 'Password reset link has been sent to the registered email.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send reset link' });
  }
});

router.post('/login', login);
router.post('/verify-otp', verifyOtp);

module.exports = router;
