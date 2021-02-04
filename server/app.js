const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const helmet = require('helmet')
const compression = require('compression')

const app = express()

// CORS middleware.
app.use(cors())

// Helmet middleware.
app.use(helmet())

// Compression.
app.use(compression())

app.use(logger('dev'))

// Api route for remoteApp
const remoteApp = require('./controllers/remoteApp.controller.js')
app.route('/api/remoteApp/:cmd').get(remoteApp.cmd)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.redirect('/')
})

module.exports = app
