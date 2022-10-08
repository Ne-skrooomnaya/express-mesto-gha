const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { authValidation, registerValidation } = require('./middlewares/validation');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const UserRoutes = require('./routes/users');
const CardRoutes = require('./routes/cards');
const { ErrorNot } = require('./utils/ErrorNot');

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

app.use(express.json());

app.post('/signup', express.json(), registerValidation, createUser);
app.post('/signin', express.json(), authValidation, login);

app.use('/', auth, UserRoutes);
app.use('/', auth, CardRoutes);
app.use('/', (req, res, next) => {
  res.status(ErrorNot).send({ message: 'Страница не найдена 3' });
  next();
});

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Ошибка на сервере 3' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
