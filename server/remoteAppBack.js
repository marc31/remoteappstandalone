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

const app = require('./app')
// const debug = require('debug')('remoteAppStandalone:server');
const http = require('http')

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '8085'
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

server.listen(port)
server.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`Port: ${port} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`Port: ${port} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
})
server.on('listening', () =>
  console.log(`Listening on port ${server.address().port}`)
)
