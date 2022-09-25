const express = require('express');
const CardRoutes = express.Router();
const { createCard, getCards, DeleteCardId, dislikeCard, likeCard, } = require('../controllers/cards');
// const Card = require('../models/Card');

CardRoutes.post('/cards', express.json(), createCard);
CardRoutes.get("/cards", express.json(), getCards);
CardRoutes.delete("/cards/:id", express.json(), DeleteCardId);
CardRoutes.put('/cards/:Id/likes', express.json(), likeCard);
CardRoutes.delete('/cards/:Id/likes', express.json(), dislikeCard);

module.exports = {
  CardRoutes,
  createCard,
  getCards,
  DeleteCardId,
  dislikeCard,
  likeCard,
};
