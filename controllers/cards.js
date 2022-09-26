/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');
const Card = require('../models/card');
const { ErrorNot, ErrorServer, ErrorBad } = require('../utils/errors.js');

const getCards = async (req, res) => {
  const cards = Card.find({});
  try {
    // const cards = Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(ErrorServer).send({ message: 'Произошла ошибка' });
  }
};
// await
const DeleteCardId = async (req, res) => {
  try {
    const card = Card.findByIdAndRemove(req.params.id);
    if (!card) {
      return res.status(ErrorNot).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    return res.send({ message: 'карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ErrorBad).send({ message: 'Переданы некорректные данные при удалении карточки.' });
    }
    return res.status(ErrorServer).send({ message: 'ошибка сервера' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании карточки.' });
    }
    return res.status(ErrorServer).send({ message: 'Произошла ошибка на сервере' });
  }
};

function searchResultHandler(res, card) {
  if (!card) {
    return res.status(ErrorNot).send({ message: 'Карточка с указанным _id не найдена.' });
  }
  res.status(200).send(card);
  res.status(ErrorServer).send({ message: 'Произошла ошибка на сервере' });
}

function searchErrorHandler(res, err, next) {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(ErrorBad).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  } else {
    next(err);
  }
}

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => searchResultHandler(res, card))
    .catch((err) => searchErrorHandler(res, err, next));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => searchResultHandler(res, card))
    .catch((err) => searchErrorHandler(res, err, next));
};

module.exports = {
  getCards,
  DeleteCardId,
  createCard,
  likeCard,
  dislikeCard,
};
