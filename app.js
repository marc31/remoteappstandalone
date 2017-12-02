'use strict';

const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const index = require('./routes/index');

const app = express();

// Helmet middleware.
app.use(helmet());

// Compression.
app.use(compression());

app.use(logger('dev'));

// view engine setup
app.set('views', './views');
app.set('view engine', 'pug');

// Static
app.use(express.static('./public'));

// Routes
app.use('/', index);
require('./routes/remonteApp.routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.redirect('/');
});

module.exports = app;
