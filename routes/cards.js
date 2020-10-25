const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, removeCard, likeCard, dislikeCard,
} = require('../controllers/card');

routerCards.get('/', getCards);

routerCards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
  }),
}), createCard);

routerCards.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
}), removeCard);

routerCards.put('/likes/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
}), likeCard);

routerCards.delete('/likes/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
}), dislikeCard);

module.exports = routerCards;
