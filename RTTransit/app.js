var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var agency = require('./routes/agency');

var app = express();

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

var Controller = require('./controllers/controller');
var allStops = {};

app.use(function (req, res, next) {
    req.allStops = allStops;
    next();
});

app.use('/', agency);
app.use('/agency', agency);


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



module.exports = {
   start: function (portNumber, cb) {
       var RTTService = require('./controllers/RTTService511');
       var service = new RTTService();
       service.getAgencies(function (agencies) {
           if (agencies) {
               for (var index = 0; index < agencies.length; index++) {
                   var agencyObj = agencies[index];
                   var agencyName = agencyObj.name;
                   var hasDirection = agencyObj.hasDirection;
                   allStops[agencyName] = agencyObj;
                   console.log('getting routes for ' + agencyName);
                   service.getRoutes(agencyName, agencyObj.hasDirection, function (routeArray, name) {
                       var agencyObj = allStops[name];
                       agencyObj.routeArray = routeArray;
                       for (var j = 0; j < routeArray.length; j++) {
                           var routeItem = routeArray[j];
                           var directionArray = routeItem.directionArray || [];
                           routeItem.directionArray = directionArray;
                           for (var k = 0; k < directionArray.length; k++) {
                               var directionItem = directionArray[k];
                               console.log('getting stops for ' + name);
                               service.getStops(name, routeItem.code, directionItem.code, function (stops) {
                                   directionItem.stops = stops;
                               });
                           }
                       }
                   });
               }
           }
           cb();
       });
   },
   app: app
};