var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var food = require('./routes/food');

var app = express();

maths = require('./my_modules/maths')

console.log('Loading food data');
food_db = require('./data/food_data.json');
console.log('Food data loaded');

console.log('Loading nutritional data');
nut_db = require('./data/nut_data.json');
console.log('Nutritional data loaded');

food_ids = [];
food_features = [];

console.log('Parsing Nutritional Data');
for(var i=0;i<nut_db.length;i++) {
    food_ids.push(nut_db[i].id);
    food_features.push(nut_db[i].features);
}
console.log('Nutritional Data Parsed');
delete nut_db;
console.log('Calculating euclidian distances');
distances = maths.pdist(food_features);
console.log('Distances computed, vector len='+distances.length);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/food', food);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;