var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const { getFirestore} = require('firebase/firestore')
const { initializeApp } = require('firebase/app')
const { getStorage } = require('firebase/storage')

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDCXnIqJfN4-T_2dDaRjfonKDvAZw726Fg',
  authDomain: 'pe-a22-6f100.firebaseapp.com',
  projectId: 'pe-a22-6f100',
  storageBucket: 'pe-a22-6f100.appspot.com',
  messagingSenderId: '213562738067',
  appId: '1:213562738067:web:0ab599bf10ee5df44b1466',
})
global.db = getFirestore(firebaseApp)
global.sto = getStorage(firebaseApp)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
