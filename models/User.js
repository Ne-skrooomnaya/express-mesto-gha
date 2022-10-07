/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isUrl = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const {
  ErrorUnauthorized,
} = require('../utils/errors');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => isUrl(url),
      message: 'Ссылка указана неверно',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Почта указана неверно',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlenght: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password, res) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(ErrorUnauthorized).send({ message: 'Неправильные почта или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(ErrorUnauthorized).send({ message: 'Неправильные почта или пароль' });
          }
          return user;
        });
    });
};

module.exports = mongoose.model('User', userSchema);
