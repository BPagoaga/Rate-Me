module.exports = (app, passport) => {

    app.get('/login', (req, res, next) => {
        res.render('user/login', {
            title: 'Login | Rate Me'
        });
    });

    app.get('/signup', (req, res, next) => {
        var errors = req.flash('error');
        res.render('user/signup', {
            title: 'Sign Up | Rate Me',
            messages: errors,
            hasErrors: errors.length > 0
        });
    });

    app.post('/signup', validate, passport.authenticate('local.signup', {
        successRediret: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }))
}

const validate = function(req, res, next) {
    req.checkBody('fullname', 'Fullname is required').notEmpty();
    req.checkBody('fullname', 'Fullname must have at least 5 characters').isLength({min: 5});
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must have at least 5 characters').isLength({min: 5});
    req.check("password", "Password must contain at least 1 number").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");   

    var errors = req.validationErrors();

    if(errors){
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg)
        });

        req.flash('error', messages);
        res.redirect('/signup');
    } else {
        return next();
    }

    
}