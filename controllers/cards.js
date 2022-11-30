const Card = require('../models/card');
const {
  ERROR_NOT_FOUND,
  ERROR_INCORRECT,
  ERROR_SERVER,
} = require('../constants');

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Что-то пошло не так' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((cardLikes) => {
      if (cardLikes == null) return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      return res.send({ data: cardLikes });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_INCORRECT).send({ message: 'Введен некорректные CardId' });
      return res.status(ERROR_SERVER).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_INCORRECT).send({ message: 'Введены некорректные данные' });
      return res.status(ERROR_SERVER).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate('owner')
    .populate('likes')
    .then((cardLikes) => {
      if (cardLikes == null) return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      return res.send({ data: cardLikes });
    })
    .catch((err) => {
      if ((req.params.cardId.length !== 24) && (err.name === 'CastError')) return res.status(ERROR_INCORRECT).send({ message: 'Введен некорректные CardId' });
      return res.status(ERROR_SERVER).send({ message: err.name });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate('owner')
    .populate('likes')
    .then((cardLikes) => {
      if (cardLikes == null) return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      return res.send({ data: cardLikes });
    })
    .catch((err) => {
      if ((req.params.cardId.length !== 24) && (err.name === 'CastError')) return res.status(ERROR_INCORRECT).send({ message: 'Введен некорректные CardId' });
      return res.status(ERROR_SERVER).send({ message: 'Что-то пошло не так...' });
    });
};
