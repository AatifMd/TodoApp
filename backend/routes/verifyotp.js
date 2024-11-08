
const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, otp, isForgotPassword  } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (isForgotPassword) {
      user.verified = true;
      await user.save();
      res.status(200).json({ message: 'OTP verified for password reset' });
    } else {
      user.verified = true;
      delete user.otp;
      await user.save();
      res.status(200).json({ message: 'OTP verification successful' });
    }
  } catch (error) {
    res.status(500).json({ message: 'OTP verification failed', error });
  }
});

module.exports = router;
