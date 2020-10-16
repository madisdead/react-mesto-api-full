const routerUsers = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateAvatar,
} = require('../controllers/user');

routerUsers.get('/', getUsers);

routerUsers.post('/', createUser);

routerUsers.get('/:id', getUser);

routerUsers.patch('/me', updateUser);

routerUsers.patch('/me/avatar', updateAvatar);

module.exports = routerUsers;
