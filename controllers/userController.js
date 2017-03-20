var Order = require('../models/order');
var Cart = require('../models/cart');
var dateFormat = require('dateformat');
var moment = require('moment');

module.exports.getProfile = function(req, res, next) {
    Order.find({ user: req.user.id }, function(err, orders) {
        if (err) {
            return res.write('Error!');
        } else {
            var cart;
            orders.forEach(function(order) {
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
                var orderDate = new Date(order.date);
                order.formattedDate = orderDate.getDate() + '/' + (orderDate.getMonth() + 1) + '/' + orderDate.getFullYear();
            });

            res.render('user/profile', { orders: orders });
        }
    });
};


module.exports.getSignup = function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages });
};

module.exports.postSignup = function(req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/buy');
    }
};

module.exports.getSignin = function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages });
};

module.exports.postSignin = function(req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/buy');
    }
};

module.exports.logout = function(req, res, next) {
    req.logout();
    res.redirect('/');
};
