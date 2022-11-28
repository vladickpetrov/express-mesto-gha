const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  .populate('=_id')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      res.status(500).send({ message: err.message })
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.send({ message: 'Карточка успешно удалена' }))
    .catch((err) => {
      res.status(500).send({ message: 'Что-то пошло не так...' })
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Введены некорректные данные' })
      res.status(500).send({ message: 'Что-то пошло не так...' })
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true })
  .populate('_id')
  .then((cardLikes) => res.send({ data: cardLikes }))
    .catch((err) => {
      res.status(500).send({ message: 'Что-то пошло не так...' })
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true })
  .populate('_id')
  .then((cardLikes) => res.send({ data: cardLikes }))
  .catch((err) => {
    res.status(500).send({ message: 'Что-то пошло не так...' })
  });
};