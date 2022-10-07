/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  ErrorConflict, ErrorNot, ErrorServer, ErrorBad,
} = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(ErrorServer).send({ message: 'Ошибка на сервере' }));
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })).then(() => {
      res.status(200).send({
        data: {
          name, about, avatar, email,
        },
      });
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ErrorBad).send({ message: 'Ошибка валидации' });
      } if (err.code === 11000) {
        return res.status(ErrorConflict).send({ message: 'Пользователь с таким email уже зарегистрирован' });
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(ErrorNot).send({ message: 'Такого пользователя не существует 1' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ErrorBad).send({ message: 'Ошибка валидации' });
    }
    res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(ErrorNot).send({ message: 'пользователь не найден' });
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(ErrorNot).send({ message: 'пользователь не найден' });
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(ErrorNot).send({ message: 'пользователь не найден' });
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
};
