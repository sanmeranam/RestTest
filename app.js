var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var basicAuth = require('express-basic-auth');
var OAuthServer = require('express-oauth-server');

var fs = require('fs');



var routes = require('./routes/index');
var users = require('./services/rest.service');

var app = express();

var OauthModel = require('./model');

app.oauth = new OAuthServer({
    model: new OauthModel()
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var _config = JSON.parse(fs.readFileSync('config.json', 'utf8'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var dbConnect = require("./services/db.service");
dbConnect.init(_config.mongo_uri);


app.use('/', routes);
app.use('/access', app.oauth.authorize());

app.use('/rest', function (req, res, next) {
    req.db = dbConnect;
    next();
}, users);

app.use('/basic/rest', basicAuth({
    users: {'admin': 'password'}
}), function (req, res, next) {
    req.db = dbConnect;
    next();
}, users);


app.use('/oauth/rest', app.oauth.authorize(), function (req, res, next) {
    req.db = dbConnect;
    next();
}, users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
