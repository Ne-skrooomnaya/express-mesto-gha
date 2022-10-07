const express = require('express');

const CardRoutes = express.Router();

const {
  createCard, getCards, DeleteCardId, dislikeCard, likeCard,
} = require('../controllers/cards');

const {
  cardValidation, cardIdValidation,
} = require('../middlewares/validation');

CardRoutes.post('/cards', express.json(), cardValidation, createCard);
CardRoutes.get('/cards', express.json(), getCards);
CardRoutes.delete('/cards/:id', express.json(), cardIdValidation, DeleteCardId);
CardRoutes.put('/cards/:id/likes', express.json(), cardIdValidation, likeCard);
CardRoutes.delete('/cards/:id/likes', express.json(), cardIdValidation, dislikeCard);

module.exports = CardRoutes;
