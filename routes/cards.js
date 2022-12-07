const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string(),
  }),
}), createCard);
router.delete('/:cardId', celebrate(), deleteCard);

router.put('/:cardId/likes', celebrate(), likeCard);
router.delete('/:cardId/likes', celebrate(), dislikeCard);

module.exports = router;
