const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('./errors/not-found-err');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user){
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ data: user })
    })
    .catch(() => res.status(404).send({ message: 'Пользователь с данным ID не найден' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) =>
      User.create({ name, about, avatar, email,
         password: hash })
      .then((user) => {
        res.status(201).send(user);
      })
      .catch(() => res.status(400).send({ message: 'Некорректные данные' })))

};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Некорректные данные' }));
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Некорректные данные' }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};