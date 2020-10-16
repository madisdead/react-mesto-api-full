const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;
  Card.create({
    name,
    link,
    owner: id,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch(() => res.status(400).send({ message: 'Некорректные данные' }));
};

module.exports.removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(() => res.send({ message: 'Вы поставили лайк' }))
    .catch(() => res.status(404).send({ message: 'Карточка с данным ID не найдена' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
  )
    .then(() => res.send({ message: 'Вы убрали лайк' }))
    .catch(() => res.status(404).send({ message: 'Карточка с данным ID не найдена' }));
};
