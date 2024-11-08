
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});


function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User Already Exists' });
    }

      const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = new User({ name, email, password: hashedPassword, otp, verified: false });
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Verify Your Account',
      text: `Your OTP for account verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
     res.status(201).json({ message: 'User registered successfully. Check your email for the OTP.' });
  } catch (error) {
    console.error('Error in registration:', error.message);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

module.exports = router;
