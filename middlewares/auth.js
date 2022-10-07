/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const {
  ErrorUnauthorized,
} = require('../utils/errors');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ErrorUnauthorized).send({ message: 'Необходима авторизация 3' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(ErrorUnauthorized).send({ message: 'Необходима авторизация 4' });
  }

  req.user = payload;
  next();
};
