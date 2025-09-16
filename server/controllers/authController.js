// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY); // set in Render env

// Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.login = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // If you want password check here, keep it. Example assumes password check done elsewhere.
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send OTP using Resend API
    try {
      await resend.emails.send({
        from: 'Portfolio <onboarding@resend.dev>', // ✅ use Resend sandbox domain
        to: user.email || process.env.EMAIL_USER, // user.email if present, otherwise admin
        subject: 'Your Portfolio Login OTP',
        // both plain and html help deliverability
        html: `<p>Your OTP for login is: <strong>${otp}</strong></p>
               <p>This OTP expires in 5 minutes.</p>`,
      });

      return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (emailErr) {
      console.error('Resend email error:', emailErr);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { username, otp } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.otp || !user.otpExpiry)
      return res
        .status(400)
        .json({ message: 'OTP not generated, please login again' });

    if (user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });

    if (Date.now() > user.otpExpiry)
      return res
        .status(400)
        .json({ message: 'OTP expired, please login again' });

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, message: 'OTP verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- Password reset handlers ----------

exports.requestPasswordReset = async (req, res) => {
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

    try {
      await resend.emails.send({
        from: 'Portfolio <onboarding@resend.dev>', // ✅ use Resend sandbox domain
        to: user.email || process.env.EMAIL_USER,
        subject: 'Password Reset Request',
        html: `<p>Click the link below to reset your password (valid 10 minutes):</p>
               <p><a href="${resetLink}">${resetLink}</a></p>`,
      });

      res.json({ message: 'Password reset link has been sent to your email.' });
    } catch (emailErr) {
      console.error('Resend error sending reset link:', emailErr);
      res.status(500).json({ error: 'Failed to send reset link' });
    }
  } catch (err) {
    console.error('Reset request error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
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
    console.error('Reset endpoint error:', err);
    res.status(500).json({ error: 'Could not reset password' });
  }
};
