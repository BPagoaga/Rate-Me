module.exports = (app) => {
    // general route for the app
    app.get('/', function(req, res, next) {
        if (!req.session.cookie.originalMaxAge === null) {
            res.redirect('/home')
        } else {
            res.render('index', {
                title: 'Rate Me'
            });

        }
    });
    // home route
    app.get('/home', function(req, res, next) {
        res.render('home', {
            title: 'Rate Me | Homepage',
            user: req.user
        });
    });
}