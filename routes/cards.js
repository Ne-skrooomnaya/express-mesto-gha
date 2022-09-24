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


// CardRoutes.post('/cards', express.json(), createCard, (req, res) => {
//   const { name, link, owner } = req.body;

//   // записываем данные в базу
//   Card.create({ name, link, owner })
//     // возвращаем записанные в базу данные пользователю
//     .then(card => res.send({ data: card }))
//     // если данные не записались, вернём ошибку
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// });