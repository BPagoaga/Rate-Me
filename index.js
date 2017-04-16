var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var expressSession = require('express-session');

var app = express();

// getting the assets
app.use(express.static('public'));
// templating engine
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    res.render('index');
})

app.listen(3000, function() {
    console.log('running');
});