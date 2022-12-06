const jwt = require('jsonwebtoken');
require('dotenv').config();
const IncorrectError = require('../errors/incorrect_error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new IncorrectError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'e5fbda01a7238de9952c8df1afe7153f89d10ae6f0cd4f5202819b2b0b185575');
  } catch (err) {
    throw new IncorrectError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};
