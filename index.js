var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var app = express();

// create db
mongoose.connect('mongodb://localhost/rateme');
// mongose.createConnections() for multiple connexions


// getting the assets
app.use(express.static('public'));
// templating engine
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'testkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.get('/', function(req, res, next) {
    res.render('index', { title: 'Rate Me | Homepage' });
});

require('./routes/user')(app);

app.listen(3000, function() {
    console.log('running');
});