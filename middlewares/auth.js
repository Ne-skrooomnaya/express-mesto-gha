/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { ErrorUnauthorized } = require('../utils/ErrorUnauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorUnauthorized('Необходима авторизация 1');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new ErrorUnauthorized('Необходима авторизация 2');
  }

  req.user = payload;
  next();
};
