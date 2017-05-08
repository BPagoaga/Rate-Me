var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async');

var crypto = require('crypto');
var User = require('../models/user');
var secret = require('../secret/secret');

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
        var info = req.flash('info');
        res.render('user/forgot', {
            title: 'Password Forgotten | Rate Me',
            messages: errors,
            hasErrors: errors.length > 0,
            info: info,
            hasInfo: info.length > 0
        })
    });

    app.post('/forgot', (req, res, next) => {
        async.waterfall([
            function(callback) {
                crypto.randomBytes(20, (err, buf) => {
                    var rand = buf.toString('hex');
                    callback(err, rand);
                });
            },

            function(rand, callback) {
                User.findOne({'email': req.body.email}, (err, user) => {
                    if(!user) {
                        req.flash('error', 'This user does not exist or email is invalid');
                        return res.redirect('/forgot');
                    }

                    user.passwordResetToken = rand;
                    user.passwordResetExpires = Date.now() + 60*60*1000;

                    user.save((err) => {
                        callback(err, rand, user)
                    });
                });
            },

            function(rand, user, callback) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: secret.auth.user,
                        pass: secret.auth.pass
                    }
                });

                var mailOptions = {
                    to: user.email,
                    from: 'Rate Me ' + '<' + secret.auth.user + '>',
                    subject: 'Rate Me | Reset Password',
                    text: 'You have requested for a password reset. \n\n'+
                        'Please click on the link to complete the process: \n\n'+
                        'http://localhost:3000/reset/'+rand+'\n\n'
                };

                smtpTransport.sendMail(mailOptions, (err, response) => {
                    req.flash('info', 'A password token has been sent to '+user.email);
                    return callback(err, user);
                });
            }
        ], (err) => {
            if(err) {
                return next(err);
            }
            
            res.redirect('/forgot');
        });

    });

    app.post('/forgot', validForgot, passport.authenticate('local.forgot', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))

    app.get('/reset/:token', (req, res) => {
        var errors = req.flash('error');
        res.render('user/reset', {
            title: 'Reset your password',
            messages: errors,
            hasErrors: errors.length > 0
        });
    });
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