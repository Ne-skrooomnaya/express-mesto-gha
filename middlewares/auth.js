const jwt = require('jsonwebtoken');
const { ErrorUnauthorized } = require('../utils/ErrorUnauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorUnauthorized('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new ErrorUnauthorized('Ошибка при авторизации'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
