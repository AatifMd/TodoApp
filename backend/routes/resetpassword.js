const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({message: 'Password reset successful'});
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({message: 'Error resetting password. Please try again.'});
  }
});

module.exports = router;
