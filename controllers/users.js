/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
const User = require('../models/User');
const { ErrorNot, ErrorServer, ErrorBad } = require('../utils/errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};
// await

const getUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(ErrorNot).send({ message: 'Такого пользователя не существует 1' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ErrorBad).send({ message: 'Ошибка валидации' });
    }
    res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
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
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(ErrorNot).send({ message: 'Такого пользователя не существует' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.owner === 'ValidationError') {
      return res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    }
    return res.status(ErrorServer).send({ message: 'Произошла ошибка' });
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
