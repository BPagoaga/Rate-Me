var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var secret = require('../secret/secret');

var User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    var newUser = new User();

    User.findOne({
        email
    }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, false, req.flash('error', 'This email is already registered'));
        }

        // passed through input name=fullname
        newUser.fullname = req.body.fullname;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        return newUser.save(() => done(null, newUser))
    })
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
        email
    }, (err, user) => {
        var messages = [];

        if (err) {
            return done(err);
        }

        if (!user || !user.validPassword(password)) {
            messages.push('This email does not match any user or email is invalid');

            return done(null, false, req.flash('error', messages));
        }

        return done(null, user);
    })
}));

passport.use('local.forgot', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, done) => {
    User.findOne({
        email
    }, (err, user) => {
        var messages = [];

        if (err) {
            return done(err);
        }

        if (!user) {
            messages.push('This email does not match any user');

            return done(null, false, req.flash('error', messages));
        }

        return done(null, user);
    })
}));

passport.use(new FacebookStrategy(secret.facebook, (req, token, refreshToken, profile, done) => {
    User.findOne({
        facebook: profile.id
    }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, user)
        } else {
            var newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.email = profile._json.email;
            newUser.tokens.push({
                token: token
            });

            newUser.save((err) => {
                return done(null, newUser);
            });
        }
    })
}));