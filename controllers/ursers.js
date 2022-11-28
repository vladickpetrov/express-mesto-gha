const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: 'Что-то пошло не так...' })
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(404).send({ message: 'Пользователь не найден' })
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Введены некорректные данные' })
      res.status(500).send({ message: 'Что-то пошло не так...' })
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true
})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Введены некорректные данные' })
      res.status(500).send({ message: 'Что-то пошло не так...' })
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const avatar = req.body.avatar;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true
})
    .then((userAvatar) => res.send({ data: userAvatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Введены некорректные данные' })
      res.status(500).send({ message: 'Что-то пошло не так...' })
    });
};