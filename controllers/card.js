const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err.js');
const RequestError = require('../errors/request-err.js');
const ServerError = require('../errors/server-err.js');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new ServerError('Ошибка на сервере');
      }
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;
  Card.create({
    name,
    link,
    owner: id,
  })
    .then((card) => {
      if (!card) {
        throw new RequestError('Некорректные данные');
      }

      res.status(201).send(card);
    })
    .catch(next);
};

module.exports.removeCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        const err = new Error('Нельзя удалить не свою карточку');
        err.statusCode = 403;

        next(err);
      }
      Card.findByIdAndRemove(card._id)
        .then((result) => {
          if (!result) {
            throw new ServerError('Произошла ошибка');
          }
          res.send(card);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Карточка с данным ID не найдена');
      }
      res.send(result);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Карточка с данным ID не найдена');
      }

      res.send(result);
    })
    .catch(next);
};
