const https = require('https')
const http = require('http')

const url = require('url')

const fs = require('fs')

const {
  rootUrl,
  loginUrl,
  user,
  password,
  saveCookiePath
} = require('./debrid.conf.js').config

const homeDir = require('os').homedir()

const { promisify } = require('util')

/**
 * Get cookie from hdd or dl it
 * @param cookie
 * @returns {Promise}
 */
function getAuthCookieCb(forceRemove, done) {
  forceRemove = forceRemove || false

  if (forceRemove) {
    fs.unlinkSync(saveCookiePath)
  }

  // Check disk cookie
  promisify(fs.readFile)(saveCookiePath)
    .then(data => {
      console.log('Use cookie From HDD')
      done(null, { cookies: data.toString('utf8') })
    })
    // Dl cookie and write it to HDD
    .catch(() => {
      dlAuthCookie()
        .then(data => writeCookieOnHdd(data.cookies.join('; ')))
        .then(data => done(null, { cookies: data }))
        .catch(e => done(e))
    })
}

/**
 * Write cookie on HDD
 * @param cookie
 * @returns {Promise}
 */
function writeCookieOnHdd(cookie) {
  return new Promise((resolve, reject) => {
    fs.writeFile(saveCookiePath, cookie, 'utf8', err => {
      if (err) {
        console.log('Error when writing cookie on HDD')
        return reject(err)
      }
      console.log('Cookie write on HDD')
      resolve(cookie)
    })
  })
}

/**
 * Dl cookie auth with pass and use
 *
 * @param done CallBack Func
 */
function dlAuthCookieCb(done) {
  const urlstring = `${rootUrl}/${loginUrl}&login_login=${user}&login_password=${password}`
  const parsedurl = url.parse(urlstring)
  const options = {
    protocol: 'https:',
    hostname: parsedurl.hostname,
    port: parsedurl.port || 443, // 80 by default
    method: 'GET',
    path: parsedurl.path,
    headers: {}
  }

  const request = https.request(options, res => {
    // Don't get data
    res.req.abort()

    // @todo do I need it ?
    res.on('end', () => {})

    // Login failed
    if (res.headers.location !== 'https://alldebrid.com/account/') {
      return done(new Error('Login failed'))
    }

    // Save Cookies
    const setcookie = res.headers['set-cookie']
    if (!setcookie) {
      return done(new Error('Login failed. No cookies'))
    }
    console.log('Cookie DL OK')
    return done(null, { msg: 'Login True; Cookies !', cookies: setcookie })
  })

  request.on('error', err => {
    done(err)
  })

  request.end() // let request know it is finished sending
}

function getDebridUrlCb(opts, done) {
  const urlstring = `${rootUrl}/service.php?link=${opts.urlToDebrid}&json=true`
  const parsedurl = url.parse(urlstring)
  const options = {
    protocol: 'https:',
    hostname: parsedurl.hostname,
    port: parsedurl.port || 443, // 80 by default
    method: 'GET',
    path: parsedurl.path,
    headers: {
      Cookie: opts.cookies
    }
  }

  const request = https.request(options, res => {
    let data = ''

    res.on('data', chunk => {
      data += chunk
    })

    res.on('end', () => {
      try {
        data = JSON.parse(data)
      } catch (e) {
        return done(new Error('Error when parsing json'))
      }

      /**
       * data = {
       *  error:
       *  filename:
       *  filesize:
       *  host:
       *  icon
       *  link
       *  nb
       *  paws
       *  streaming: {
       *      360p unknown 0:
       *    }
       * }
       *
       */
      console.log(data.link)
      return done(null, { msg: 'Get Url OK !', url: data.link, data })
    })
  })

  request.on('error', err => done(err))

  request.end() // let request know it is finished sending
}

/**
 * https://gist.github.com/falkolab/f160f446d0bda8a69172
 */
function dlFileCb(opts, done) {
  const timeout = 10000

  const timeout_wrapper = function(req) {
    return function() {
      console.log('abort')
      req.abort()
      done('File transfer timeout!')
    }
  }

  const file = fs.createWriteStream(opts.dest)

  file.on('error', err => {
    clearTimeout(timeoutId)
    done(err)
  })

  file.on('open', () => {
    const request = http.get(opts.url).on('response', res => {
      const len = parseInt(res.headers['content-length'], 10)
      let downloaded = 0

      res.on('data', chunk => {
        file.write(chunk)
        downloaded += chunk.length
        console.log(
          `Downloading ${((100.0 * downloaded) / len).toFixed(
            2
          )}% ${downloaded} bytes` + '\r'
        )
        // reset timeout
        clearTimeout(timeoutId)
        timeoutId = setTimeout(fn, timeout)
      })

      res.on('end', () => {
        // clear timeout
        clearTimeout(timeoutId)
        file.end()
        console.log(`${opts.url} downloaded to: ${opts.dest}`)
        return done(null, { msg: `${opts.url} downloaded to: ${opts.dest}` })
      })

      res.on('error', err => {
        // clear timeout
        clearTimeout(timeoutId)
        done(err)
      })
    })

    // generate timeout handler
    let fn = timeout_wrapper(request)

    // set initial timeout
    let timeoutId = setTimeout(fn, timeout)

    request.on('error', err => {
      try {
        // clear timeout
        clearTimeout(timeoutId)
      } catch (e) {}
      done(err)
    })

    request.end() // let request know it is finished sending
  })
}

const getAuthCookie = promisify(getAuthCookieCb)
const dlAuthCookie = promisify(dlAuthCookieCb)
const getDebridUrl = promisify(getDebridUrlCb)
const dlFile = promisify(dlFileCb)

function startPromise(urlToDebrid) {
  getAuthCookie(false)
    .then(data =>
      getDebridUrl({
        urlToDebrid,
        cookies: data.cookies
      })
    )
    .then(data =>
      dlFile(
        {
          url: data.url,
          dest: `${homeDir}/Downloads/${data.data.filename}`
        },
        () => console.log('Dl is finished')
      )
    )
    .catch(e => console.log(e))
}

function startCB(urlToDebrid) {
  getAuthCookie(false, (err, data) => {
    if (err) return console.log(err)
    console.log(data.msg)

    getDebridUrl(
      {
        urlToDebrid,
        cookies: data.cookies
      },
      (err, data) => {
        if (err) return err
        console.log(data.msg)
        console.log(data.url)

        dlFile(
          {
            url: data.url,
            dest: `${homeDir}/Downloads/${data.data.filename}`
          },
          () => console.log('Dl is finished')
        )
      }
    )
  })
}
