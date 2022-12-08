const Card = require('../models/card');
const IncorrectError = require('../errors/incorrect_error');
const NotFoundError = require('../errors/not_found_error');
const PermissionError = require('../errors/permission_error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card == null) throw new NotFoundError('Карточка не найдена');
      if (card.owner.toString() !== req.user._id) throw new PermissionError('Вы можете удалить только свою карточку');
    })
    .then(() => {
      Card.findByIdAndDelete(req.params.cardId)
        .then((card) => {
          res.send({ data: card });
        })
        .catch((err) => {
          if (err.name === 'CastError') throw new IncorrectError('Введен некорректные CardId');
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') throw new IncorrectError('Введены некорректные данные');
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card == null) throw new NotFoundError('Карточка не найдена');
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new IncorrectError('Введен некорректные CardId');
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card == null) throw new NotFoundError('Карточка не найдена');
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new IncorrectError('Введен некорректные CardId');
      next(err);
    });
};
