module.exports = (app) => {
    app.get('/login', (req, res, next) => {
        res.render('user/login', { title: 'Login | Rate Me' });
    });

    app.get('/signup', (req, res, next) => {
        res.render('user/signup', { title: 'Sign Up | Rate Me' });
    });
}