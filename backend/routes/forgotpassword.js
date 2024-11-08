const express = require('express');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const router = express.Router();

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
  const { email } = req.body; 

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   const otp = generateOTP();

    user.otp = otp;
    await user.save();

    
    const mailOptions = {
      from: process.env.EMAIL, 
      to: user.email,          
      subject: 'Password Reset OTP', 
      text: `Your OTP for password reset is: ${otp}`, 
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP email', error });
      }
      res.status(200).json({ message: 'OTP sent to email' });
    });

  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Error generating OTP' });
  }
});

module.exports = router;
