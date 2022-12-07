const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const IncorrectError = require('../errors/incorrect_error');
const NotFoundError = require('../errors/not_found_error');
const AlredyExistsError = require('../errors/already_exists_error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) throw new NotFoundError('Пользователь не найден');
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new IncorrectError('Введен некорректные Id');
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 12)
    .then((hashPass) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashPass,
      })
        .then((user) => {
          const newUser = user.toObject();
          delete newUser.password;
          res.send(newUser);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') next(new IncorrectError('Введены некорректные данные'));
          if (err.code === 11000) next(new AlredyExistsError('Пользователь уже существует'));
        });
    })
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) Promise.reject(new IncorrectError('Неправильная почта или пароль'));
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) Promise.reject(new IncorrectError('Неправильная почта или пароль'));
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'e5fbda01a7238de9952c8df1afe7153f89d10ae6f0cd4f5202819b2b0b185575',
        { expiresIn: '7d' },
      );
      res.send({ data: user });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .end();
    })
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') throw new IncorrectError('Введен некорректные Id');
      if (err.name === 'ValidationError') throw new IncorrectError('Введены некорректные данные');
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') throw new IncorrectError('Введен некорректные Id');
      if (err.name === 'ValidationError') throw new IncorrectError('Введены некорректные данные');
      next(err);
    });
};
