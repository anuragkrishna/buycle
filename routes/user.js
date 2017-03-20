var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var csrfProtection = csrf();

var userController = require('../controllers/userController');
var utils = require('../utils/utils');


router.use(csrfProtection);

router.get('/profile', utils.isLoggedIn, userController.getProfile);

router.get('/logout', utils.isLoggedIn, userController.logout);

router.use('/', utils.notLoggedIn, function(req, res, next) {
    next();
});

router.get('/signup', userController.getSignup);

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}), userController.postSignup);

router.get('/signin', userController.getSignin);

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), userController.postSignin);


module.exports = router;


