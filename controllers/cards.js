/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
const Card = require('../models/Card');
const {
  ErrorForbidden, ErrorNot, ErrorServer, ErrorBad,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(ErrorServer).send({ message: 'Ошибка на сервере' }));
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(200).send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ErrorBad).send({ message: 'Ошибка валидации' });
    }
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

const DeleteCardId = async (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(ErrorNot).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (card.owner.toString() === req.user._id) {
        res.status(200).send(card);
      } else {
        return res.status(ErrorForbidden).send({ message: 'Удаление чужой карточки невозможно' });
      }
    })
    .catch(next);
};
//   const { id } = req.params;
//   try {
//     const card = await Card.findByIdAndRemove(id);
//     if (!card) {
// return res.status(ErrorNot).send({ message: 'Карточка с указанным _id не найдена.' });
//     }
//     if (card.owner.toString() === req.user._id) {
//       res.status(200).send(card);
//     } else {
//       return res.status(ErrorForbidden).send({ message: 'Удаление чужой карточки невозможно' });
//     }
//     return res.status(200).send({ message: 'карточка удалена' });
//   } catch (err) {
//     if (err.name === 'CastError') {
//       return res.status(ErrorBad)
// .send({ message: 'Переданы некорректные данные при удалении карточки.' });
//     }
//     return res.status(ErrorServer).send({ message: 'ошибка сервера' });
//   }
// };

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(ErrorNot).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    res.status(200).send({ data: card });
  }).catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    }
    return res.status(ErrorServer).send({ message: 'ошибка сервера' });
  });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(ErrorNot).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    res.status(200).send({ data: card });
  }).catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    }
    return res.status(ErrorServer).send({ message: 'ошибка сервера' });
  });
};

module.exports = {
  getCards,
  DeleteCardId,
  createCard,
  likeCard,
  dislikeCard,
};
