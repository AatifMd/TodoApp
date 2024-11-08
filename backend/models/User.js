
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: false },     
  verified: { type: Boolean, default: false },
  todos: [
    {
      title: { type: String, required: true },
      desc: { type: String, required: true },
      completed: { type: Boolean, default: false },
    }
  ]
  
});

module.exports = mongoose.model('User', userSchema);
