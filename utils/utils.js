module.exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.oldUrl = req.url;
        res.redirect('/user/signin');
    }
};

module.exports.notLoggedIn = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};
