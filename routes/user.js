module.exports = (app, passport) => {

    app.get('/login', (req, res, next) => {
        var errors = req.flash('error');
        res.render('user/login', {
            title: 'Login | Rate Me',
            messages: errors,
            hasErrors: errors.length > 0
        });
    });

    app.post('/login', validLogin, passport.authenticate('local.login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', (req, res, next) => {
        var errors = req.flash('error');
        res.render('user/signup', {
            title: 'Sign Up | Rate Me',
            messages: errors,
            hasErrors: errors.length > 0
        });
    });

    app.post('/signup', validSignUp, passport.authenticate('local.signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/forgot', (req, res, next) => {
        var errors = req.flash('error');
        res.render('user/forgot', {
            title: 'Password Forgotten | Rate Me',
            messages: errors,
            hasErrors: errors.length > 0
        })
    });

    app.post('/forgot', validForgot, passport.authenticate('local.forgot', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))
}

const validSignUp = function(req, res, next) {
    req.checkBody('fullname', 'Fullname is required').notEmpty();
    req.checkBody('fullname', 'Fullname must have at least 5 characters').isLength({ min: 5 });
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must have at least 5 characters').isLength({ min: 5 });
    req.check("password", "Password must contain at least 1 number").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");

    return handleErrors(req.validationErrors(), '/signup', next);
}

const validLogin = function(req, res, next) {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must have at least 5 characters').isLength({ min: 5 });
    req.check("password", "Password must contain at least 1 number").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");

    return handleErrors(req.validationErrors(), '/login', next);
}

const validForgot = function(req, res, next) {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();

    return handleErrors(req.validationErrors(), '/forgot', next);
}

const handleErrors = function(validationErrors, redirect, next) {
    var errors = validationErrors;

    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg)
        });

        req.flash('error', messages);
        res.redirect(redirect);
    } else {
        return next();
    }
}