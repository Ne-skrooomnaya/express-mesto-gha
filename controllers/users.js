/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { ErrorBad } = require('../utils/ErrorBad');
const { ErrorConflict } = require('../utils/ErrorConflict');
const { ErrorNot } = require('../utils/ErrorNot');
const { ErrorServer } = require('../utils/ErrorServer');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(200).send({
      data: {
        name, about, avatar, email,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    if (err.code === 11000) {
      return next(new ErrorConflict('Пользователь с таким email уже зарегистрирован 5'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const getUserId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorNot('Такого пользователя не существует 1'));
    }
    return res.status(200).send({ user });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const updateUserInfo = async (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new ErrorNot('Такого пользователя не существует 1'));
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new ErrorNot('Такого пользователя не существует 1'));
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const user = await User.findById(owner);
    if (!user) {
      return next(new ErrorNot('Такого пользователя не существует 1'));
    }
    return res.status(200).send(user);
  } catch (err) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'SECRET', { expiresIn: '7d' });
      res.send({ token });
    }).catch(next);
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
