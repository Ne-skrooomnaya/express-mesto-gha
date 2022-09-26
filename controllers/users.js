/* eslint-disable consistent-return */
const User = require('../models/user');
const { ErrorNot, ErrorServer, ErrorBad } = require('../utils/errors');

const getUsers = async (req, res) => {
  // const users = User.find({});
  try {
    const users = User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(ErrorServer).send({ message: 'Произошла ошибка', ...err });
  }
};
// await

const getUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = User.findById(id);

    if (!user) {
      res
        .status(ErrorNot)
        .send({ message: 'Такого пользователя не существует' });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(ErrorServer).send({ message: 'Произошла ошибка c id', ...err });
  }
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.', ...err }));
};

const updateUserInfo = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(ErrorNot)
        .send({ message: 'Такого пользователя не существует' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(ErrorBad)
        .send({
          message: 'Переданы некорректные данные при создании пользователя.',
          ...err,
        });
    }
    res.status(ErrorServer).send({ message: 'Произошла ошибка', ...err });
  }
};

const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(ErrorNot)
        .send({ message: 'Такого пользователя не существует' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(ErrorBad)
        .send({
          message: 'Переданы некорректные данные при создании пользователя.',
          ...err,
        });
    }
    res.status(ErrorServer).send({ message: 'Произошла ошибка', ...err });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
};
