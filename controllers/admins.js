/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const { ErrorServer, ErrorBad } = require('../utils/errors');

// cost
const SALT_ROUNDS = 10;
const JWT_SECRET = 'dljncjdncjdncjndxxjnlmnkmkknkkn';

const register = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(ErrorBad).send({ message: 'Ошибка валидации' });
  }

  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    return Admin.findOne({ email }).then((admin) => {
      if (admin) {
        return res.status(403).send({ message: 'Пользователь с таким email уже зарегистрирован' });
      }
      return Admin.create({ ...req.body, password: hash }).then((user) => {
        return res.status(200).send(user);
      }).catch(() => res.status(ErrorServer).send({ message: 'Ошибка на сервере 1' }));
    }).catch(() => res.status(ErrorServer).send({ message: 'Ошибка на сервере 2' }));
  });
};

const auth = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(ErrorBad).send({ message: 'Ошибка валидации' });
  }
  return Admin.findOne({ email }).then((admin) => {
    if (!admin) {
      return res.status(403).send({ message: 'Пользователя нет' });
    }
    bcrypt.compare(password, admin.password, (error, isValidPassword) => {
      if (!isValidPassword) {
        return res.status(401).send({ message: 'Пароль неверен' });
      }
      const token = jwt.sign({ id: admin.id }, JWT_SECRET);
      console.log(token);
      return res.status(200).send({ token });
    });
  }).catch(() => res.status(400).send({ message: 'Ошибка на сервере 2' }));
};

module.exports = {
  register,
  auth,
};
