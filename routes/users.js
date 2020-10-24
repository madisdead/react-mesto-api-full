const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/user');

routerUsers.get('/', getUsers);

routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
}), updateUser);

routerUsers.get('/:id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
}), getUser);

routerUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().min(2).pattern(/^(http[s]?:\/\/)+([\da-z?$%&_/]+)#?/),
  }),
}), updateAvatar);

module.exports = routerUsers;
