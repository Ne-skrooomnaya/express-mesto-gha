const express = require('express');
const UserRoutes = express.Router();
const { createUser, getUsers, getUserId, updateUserInfo, updateUserAvatar } = require('../controllers/users');
// const User = require('../models/User');

UserRoutes.post('/users', express.json(), createUser);
UserRoutes.get("/users", express.json(), getUsers);
UserRoutes.get("/users/:id", express.json(), getUserId);
UserRoutes.patch('/me', express.json(), updateUserInfo);
UserRoutes.patch('/me/avatar', express.json(), updateUserAvatar);


module.exports = {
  UserRoutes,
  getUsers,
  getUserId,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
