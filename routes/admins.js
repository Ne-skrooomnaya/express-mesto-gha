const express = require('express');

const AdminRoutes = express.Router();
const { register, auth } = require('../controllers/admins');

AdminRoutes.post('/register', express.json(), register);
AdminRoutes.post('/auth', express.json(), auth);

module.exports = AdminRoutes;
