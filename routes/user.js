module.exports = (app, passport) => {
    app.get('/login', (req, res, next) => {
        res.render('user/login', { title: 'Login | Rate Me' });
    });

    app.get('/signup', (req, res, next) => {
        res.render('user/signup', { title: 'Sign Up | Rate Me' });
    });

    app.post('/signup', passport.authenticate('local.signup', {
        successRediret: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }))
}