const express = require('express');

const UserRoutes = express.Router();

const auth = require('../middlewares/auth');

const {
  userValidation, userIdValidation, avatarValidation, registerValidation, authValidation,
} = require('../middlewares/validation');

const {
  getUserInfo, getUsers, getUserId, updateUserInfo, updateUserAvatar, createUser, login,
} = require('../controllers/users');

UserRoutes.post('/signup', express.json(), registerValidation, createUser);
UserRoutes.post('/signin', express.json(), authValidation, login);
UserRoutes.use(auth);

UserRoutes.get('/users', express.json(), getUsers);
UserRoutes.get('/users/me', express.json(), getUserInfo);
UserRoutes.get('/users/id', express.json(), userIdValidation, getUserId);
UserRoutes.patch('/users/me', express.json(), userValidation, updateUserInfo);
UserRoutes.patch('/users/me/avatar', express.json(), avatarValidation, updateUserAvatar);

module.exports = UserRoutes;
