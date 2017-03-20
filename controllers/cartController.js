var Cart = require('../models/cart');
var Order = require('../models/order');
var Product = require('../models/product');


module.exports.getHome = function(req, res, next) {
    res.render('home', { title: "Welcome" });
};

module.exports.getAllProducts = function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function(err, products) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < products.length; i += chunkSize) {
            productChunks.push(products.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
    });
};

module.exports.getCart = function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { products: null });
    }

    var cart = new Cart(req.session.cart);
    return res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
};

module.exports.addToCart = function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, productId);
        req.session.cart = cart;
        res.status(200).send(JSON.stringify({ cartQty: cart.totalQty}));
    });
};

module.exports.reduceByOne = function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;

    res.redirect('/shopping-cart');
};

module.exports.getCheckout = function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }

    var cart = new Cart(req.session.cart);

    var errMsg = req.flash('error')[0]; //Flash convention
    return res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
};

module.exports.postCheckout = function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }

    var cart = new Cart(req.session.cart);
    var stripe = require("stripe")(
        "sk_test_xMus0HFoUgdnoq48qb9FCNOR"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        } else {
            var order = new Order({
                user: req.user,
                cart: cart,
                address: req.body.address,
                name: req.body.name,
                paymentId: charge.id
            });
            order.save(function(err, result) {

                //Error handling not done. do it!
                req.flash('success', "Successfully bought");
                req.cart = null;
                res.redirect('/');
            });
        }
    });
};


module.exports.removeItem = function(req, res, next) {

    console.log("Received Request");
    var itemId = req.params.id;

    if (req.session.cart) {
        var cart = new Cart(req.session.cart);
        cart.removeItem(itemId);
        req.session.cart = cart;

        console.log("Total for Request", { total: cart.totalPrice, qty: cart.totalQty });

        res.status(200).send(JSON.stringify({ total: cart.totalPrice, qty: cart.totalQty }));
    }
};
