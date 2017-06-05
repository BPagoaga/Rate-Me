var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

require('./config/passport');
require('./secret/secret');

//  Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;
// create db
mongoose.connect('mongodb://localhost/rateme');
// mongose.createConnections() for multiple connexions


// getting the assets
app.use(express.static('public'));
// templating engine
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(validator());

app.use(session({
    secret: 'testkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// add passport middleware after the session middleware declaratiuon
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// user related routes
require('./routes/user')(app, passport);

app.listen(3000, function() {
    console.log('running');
});