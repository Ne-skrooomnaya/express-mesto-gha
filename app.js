/* eslint-disable no-console */
const mongoose = require('mongoose');
const express = require('express');
// const path = require('path');
const { ErrorNot } = require('./utils/errors');
const UserRoutes = require('./routes/users');
const CardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err.name}: ${err.message}`));

app.use((req) => {
  req.user = {
    _id: '632e3013375cfba161288833',
  };
});

app.use(express.json());

app.use(UserRoutes);
app.use(CardRoutes);

app.use((req, res, next) => {
  res.status(ErrorNot).send({ message: 'Произошла ошибка' });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
