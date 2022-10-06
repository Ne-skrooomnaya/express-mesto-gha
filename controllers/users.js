/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
// const bcrypt = require('bcryptjs'); // импортируем bcrypt
const User = require('../models/User');
const { ErrorNot, ErrorServer, ErrorBad } = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(ErrorServer).send({ message: 'Ошибка на сервере' }));
};

const createUser = async (req, res) => {
  try {
    const user = await new User(req.body).save();
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ErrorBad).send({ message: 'Ошибка валидации' });
    }
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

// const createUser = async (req, res) => {
//   bcrypt.hash(req.body.password, 10).then((hash) => User.create({
//     email: req.body.email,
//     password: hash, // записываем хеш в базу
//   }));
//   try {
//     const user = await new User(req.body).save();
//     return res.send(user);
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       return res.status(ErrorBad).send({ message: 'Ошибка валидации' });
//     } if (err.code === 11000) {
//       return res.status(ErrorBad)
// .send({ message: 'Пользователь с таким email уже зарегистрирован' });
//     }
//     return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
//   }
// };

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

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
};
