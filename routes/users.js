const express = require('express');

const UserRoutes = express.Router();
const {
  createUser, getUsers, getUserId, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

UserRoutes.post('/users', express.json(), createUser);
UserRoutes.get('/users', express.json(), getUsers);
UserRoutes.get('/users/:id', express.json(), getUserId);
UserRoutes.patch('/me', express.json(), updateUserInfo);
UserRoutes.patch('/me/avatar', express.json(), updateUserAvatar);

module.exports = UserRoutes;
