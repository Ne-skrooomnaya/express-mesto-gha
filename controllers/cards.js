/* eslint-disable import/no-unresolved */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */

// const mongoose = require('mongoose');
const Card = require('../models/Card');
const { ErrorNot, ErrorServer, ErrorBad } = require('../utils/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.', ...err }));
};

const DeleteCardId = async (req, res) => {
  try {
    const card = Card.findByIdAndRemove(req.params.id);
    if (!card) {
      return res.status(ErrorNot).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    return res.status(200).send({ message: 'карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ErrorBad).send({ message: 'Переданы некорректные данные при удалении карточки.' });
    }
    return res.status(ErrorServer).send({ message: 'ошибка сервера' });
  }
};

// function searchResultHandler(res, card) {
//   if (!card) {
//     return res.status(ErrorNot).send({ message: 'Карточка с указанным _id не найдена.' });
//   }
//   res.status(200).send(card);
//   res.status(ErrorServer).send({ message: 'Произошла ошибка на сервере' });
// }

// function searchErrorHandler(res, err, next) {
//   if (err instanceof mongoose.Error.CastError) {
//     return res.status(ErrorBad)
// .send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
//   } else {
//     next(err);
//   }
// }

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new ErrorNot('Карточка не найдена');
    }
    res.status(200).send({ data: card });
  }).catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ErrorBad(`Ошибка валидации: ${err.message}`));
    } else {
      next(err);
    }
  });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new ErrorNot('Карточка не найдена');
    }
    res.status(200).send({ data: card });
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new ErrorBad(`Ошибка валидации: ${err.message}`));
    } else {
      next(err);
    }
  });
};

module.exports = {
  getCards,
  DeleteCardId,
  createCard,
  likeCard,
  dislikeCard,
};
