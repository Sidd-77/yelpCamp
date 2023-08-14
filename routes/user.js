const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/user');

router.get('/register', users.registerForm);

router.post('/register', catchAsync(users.createUser));

router.get('/login', users.loginForm);

router.post('/login', passport.authenticate('local', {
    failureFlash:true,
    failureRedirect:'/users/login',
}), users.login);

router.get('/logout', users.logout);

module.exports = router;