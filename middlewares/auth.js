const jwt = require('jsonwebtoken');
require('dotenv').config();
const IncorrectError = require('../errors/incorrect_error');

module.exports = (req, res, next) => {
  const { authToken } = req.headers;

  if (!authToken || !authToken.startsWith('Bearer ')) {
    const err = new IncorrectError('Необходима авторизация');
    next(err);
  }

  const token = authToken.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'e5fbda01a7238de9952c8df1afe7153f89d10ae6f0cd4f5202819b2b0b185575');
  } catch (err) {
    throw new IncorrectError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};
