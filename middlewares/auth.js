const jwt = require('jsonwebtoken');
const { ErrorUnauthorized } = require('../utils/ErrorUnauthorized');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new ErrorUnauthorized('Ошибка при авторизации'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
