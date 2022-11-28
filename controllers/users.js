const User = require('../models/user');

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) return res.status(404).send({ message: 'Пользователь не найден' });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Введен некорректные Id' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Введены некорректные данные' });
      return res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name)
      res.status(500).send({ message: err.name })
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
  })
    .then((user) => res.send({ avatar: user.avatar }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
