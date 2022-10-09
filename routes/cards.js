const express = require('express');

const CardRoutes = express.Router();

const {
  createCard, getCards, deleteCardId, dislikeCard, likeCard,
} = require('../controllers/cards');

const {
  cardValidation, cardIdValidation,
} = require('../middlewares/validation');

CardRoutes.post('/cards', express.json(), cardValidation, createCard);
CardRoutes.get('/cards', express.json(), getCards);
CardRoutes.delete('/cards/_id', express.json(), cardIdValidation, deleteCardId);
CardRoutes.put('/cards/_id/likes', express.json(), cardIdValidation, likeCard);
CardRoutes.delete('/cards/_id/likes', express.json(), cardIdValidation, dislikeCard);

module.exports = CardRoutes;
