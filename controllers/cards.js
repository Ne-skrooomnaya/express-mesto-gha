/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
const Card = require('../models/Card');

const { ErrorBad } = require('../utils/ErrorBad');
const { ErrorForbidden } = require('../utils/ErrorForbidden');
const { ErrorNot } = require('../utils/ErrorNot');
const { ErrorServer } = require('../utils/ErrorServer');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(200).send({ card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const deleteCardId = async (req, res, next) => {
  const { id } = req.params;
  const owner = req.user._id;
  try {
    const card = await Card.findByIdAndRemove(id);
    if (!card) {
      return next(new ErrorNot('Карточка с указанным _id не найдена.'));
    }
    if (owner !== card.owner.toString()) {
      return next(new ErrorForbidden('Вы не можете удалить чужую карточку'));
    }
    await Card.findByIdAndRemove(card);
    return res.status(200).send({ message: 'карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new ErrorNot('Карточка с указанным _id не найдена.'));
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new ErrorNot('Карточка с указанным _id не найдена.'));
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

module.exports = {
  getCards,
  deleteCardId,
  createCard,
  likeCard,
  dislikeCard,
};
