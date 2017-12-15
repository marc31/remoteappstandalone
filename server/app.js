const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Helmet middleware.
app.use(helmet());

// Compression.
app.use(compression());

app.use(logger('dev'));

// Static
app.use('/', express.static(`${__dirname}../../client/dist/`));

// First Page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: `${__dirname}../../client/dist` });
});

// Api route
const remoteApp = require('./controllers/remoteApp.controllers');

app.route('/api/remoteApp/:toDo')
  .get(remoteApp.toDo);

// Redirect in all other case
app.get('/*', (req, res) => {
  res.redirect('/');
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.redirect('/');
});

module.exports = app;
