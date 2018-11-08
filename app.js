var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');
var index = require('./routes/index');
var tasksRouter = require('./routes/tasks');
var shoppinglistRouter = require('./routes/shoppinglist');
var apartmentRouter = require('./routes/apartments');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');

const PORT = 8000;

var app = express();

// CORS Middleware
app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.use('/users', users);
app.use('/tasks', tasksRouter);
app.use('/shoppinglist', shoppinglistRouter);
app.use('/apartments', apartmentRouter);
app.use('/users', usersRouter);

//making it ready for deploy. telling express to send index file on request, and letting it know to serve up static files.
app.use( express.static( `${__dirname}/React/build` ) );
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, 'React/build/index.html'));
});

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

var server = app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});

mongoose.connect('mongodb://localhost:27017/lazyRoomies', {
  server: {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  }
}, function (err, db) {
  if (err) throw err;
  console.log("*********** Database connected! **********");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err);
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
