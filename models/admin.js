const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  // validate: {
  //   // validator: (v) => isEmail(v),
  //   message: 'Неправильный формат почты',
  // },
  },
  password: {
    type: String,
    required: true,
    // select: false,
    minlenght: 8,
  },
});

module.exports = mongoose.model('Admin', adminSchema);
