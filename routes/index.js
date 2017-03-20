var express = require('express');
var router = express.Router();

var cartController = require('../controllers/cartController');
var utils = require('../utils/utils');

router.get('/', cartController.getHome);

router.get('/buy', cartController.getAllProducts);

router.get('/add-to-cart/:id', cartController.addToCart);

router.get('/reduce/:id', cartController.reduceByOne);

router.get('/shopping-cart', cartController.getCart);

router.get('/checkout', utils.isLoggedIn, cartController.getCheckout);

router.post('/checkout', utils.isLoggedIn, cartController.postCheckout);

router.get('/remove/:id', cartController.removeItem);

module.exports = router;
