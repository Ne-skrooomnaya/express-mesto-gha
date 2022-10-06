const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   // validate: {
  //   //   // validator: (v) => isEmail(v),
  //   //   message: 'Неправильный формат почты',
  //   // },
  // },
  // password: {
  //   type: String,
  //   required: true,
  //   // select: false,
  //   minlenght: 8,
  // },
});

module.exports = mongoose.model('User', userSchema);
