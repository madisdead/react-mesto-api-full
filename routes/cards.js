const routerCards = require('express').Router();
const {
  getCards, createCard, removeCard, likeCard, dislikeCard,
} = require('../controllers/card');

routerCards.get('/', getCards);

routerCards.post('/', createCard);

routerCards.delete('/:_id', removeCard);

routerCards.put('/:cardId/likes', likeCard);

routerCards.delete('/:cardId/likes', dislikeCard);

module.exports = routerCards;
