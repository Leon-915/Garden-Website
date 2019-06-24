var express = require('express');
//var multer = require('multer');
var path = require('path');
var logger = require('morgan');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
var connection  = mongoose.connect('mongodb://localhost/iow_db', { useMongoClient: true })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

autoIncrement.initialize(mongoose.connection);
bucketSuffix = "";


//var logger = require('morgan');
//app.use(logger('dev'));
//app.use(cors()); 

//var categories = require('./routes/categories');
//var business = require('./routes/business');

//var ratings = require('./routes/ratings');
//var events = require('./routes/events');
//var offers = require('./routes/offers');




app.use(cors()); 

var users = require('./routes/users');
var jobs = require('./routes/jobs');
var auth = require('./routes/auth');
var utils = require('./routes/utilities');


app.use(bodyParser.urlencoded({
  extended: true
}));



app.use(logger('dev'));
app.use(bodyParser.json());
 
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.all('/gardenhelp/api/v1/*', [require('./middlewares/validateRequest')]);
app.use('/gardenhelp/', auth);
app.use('/gardenhelp/api/v1/users', users);
app.use('/gardenhelp/api/v1/jobs', jobs);
app.use('/gardenhelp/api/v1/utils', utils);



/*app.use('/categories', categories);
app.use('/business', business);
app.use('/users', users);
app.use('/ratings', ratings);
app.use('/events', events);
app.use('/offers', offers);*/
//app.use(multer({dest:__dirname+'/file/uploads/'}).any());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// error handlers

// development error handler
// will print stacktrace
/*  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}*/

// production error handler
// no stacktraces leaked to user
/*app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/






//var port = 9000;
//app.listen(port);
//console.log('Listening on port', port);

app.set('port', process.env.PORT || 9000);
var server = app.listen(app.get('port'), function() {
 console.log('Express server listening on port ' + server.address().port);
});