#!/usr/bin/env node

// Check if NODE_ENV is set.
if (!process.env.NODE_ENV) {
  // If no NODE_ENV, default set to development.
  console.error(
    'WARNING: NODE_ENV is not defined! Set development environment by default'
  )
  process.env.NODE_ENV = 'development'
}

if (process.env.NODE_ENV !== 'production') {
  console.error('WARNING: Your running your app in development mode')
} else {
  console.info('Your running your app in production mode')
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10)

  if (Number.isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Module dependencies.
 */
const app = require('./app')
// const debug = require('debug')('remoteAppStandalone:server');
const http = require('http')

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '8085')
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  console.log(`Listening on ${bind}`)
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
