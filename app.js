/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { authValidation, registerValidation } = require('./middlewares/validation');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { ErrorNot } = require('./utils/ErrorNot');
const UserRoutes = require('./routes/users');
const CardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err.name}: ${err.message}`));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.post('/signin', authValidation, login);
app.post('/signup', registerValidation, createUser);

app.use('/', auth, UserRoutes);
app.use('/', auth, CardRoutes);
app.use('/', (req, res, next) => {
  res.status(ErrorNot).send({ message: 'Страница не найдена 3' });
  next();
});

app.use(errors());

app.use((req, res, next) => {
  res.status(ErrorNot).send({ message: 'Произошла ошибка 4' });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
