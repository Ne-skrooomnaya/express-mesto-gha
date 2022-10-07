const express = require('express');
const {
  userValidation, userIdValidation, avatarValidation,
} = require('../middlewares/validation');

const UserRoutes = express.Router();
const {
  getUserInfo, getUsers, getUserId, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

// UserRoutes.post('/users', express.json(), createUser);
UserRoutes.get('/users', express.json(), getUsers);
UserRoutes.get('/users/me', express.json(), getUserInfo);
UserRoutes.get('/users/:id', express.json(), userIdValidation, getUserId);
UserRoutes.patch('/users/me', express.json(), userValidation, updateUserInfo);
UserRoutes.patch('/users/me/avatar', express.json(), avatarValidation, updateUserAvatar);

module.exports = UserRoutes;
