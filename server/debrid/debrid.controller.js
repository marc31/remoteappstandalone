const https = require('https')

const url = require('url')

const fs = require('fs')

const {
  rootUrl,
  loginUrl,
  user,
  password,
  saveCookiePath
} = require('./debrid.conf.js').config

const { promisify } = require('util')

/**
 * Get cookie from hdd or dl it
 * @returns cookie
 */
async function getAuthCookie(forceRemove2) {
  const forceRemove = forceRemove2 || false

  let cookie

  // Remove Old Cookie
  if (forceRemove) {
    try {
      fs.unlinkSync(saveCookiePath)
    } catch (e) {
      console.log('Error when trying to delete cookie')
    }
  }

  // Try to read From HDD
  try {
    cookie = await promisify(fs.readFile)(saveCookiePath)
    cookie = cookie.toString('utf8')
    console.log('Use cookie from HDD')
    return cookie

    // Not on HDD => DL it and write it to hdd
  } catch (e) {
    try {
      // DL it from web
      cookie = await dlAuthCookie()

      // Write it on HDD
      try {
        await writeCookieOnHdd(cookie.join('; '))
      } catch (e) {
        console.error('Bug when trying to write cookie on hdd')
      }

      return cookie
    } catch (e) {
      return e
    }
  }
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
 * @returns {Promise}
 */
function dlAuthCookie() {
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

  return new Promise((resolve, reject) => {
    const request = https.request(options, res => {
      // Don't get data
      res.req.abort()

      // @todo do I need it ?
      res.on('end', () => {})

      // Login failed
      if (res.headers.location !== 'https://alldebrid.com/account/') {
        return reject(new Error('Login failed'))
      }

      // Save Cookies
      const setcookie = res.headers['set-cookie']
      if (!setcookie) {
        return reject(new Error('Login failed. No cookies'))
      }
      console.log('Cookie DL OK')
      return resolve(setcookie)
    })

    request.on('error', err => reject(err))

    request.end() // let request know it is finished sending
  })
}

function getDebridUrlHandler(opts) {
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

  return new Promise((resolve, reject) => {
    const request = https.request(options, res => {
      let data = ''

      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => {
        try {
          data = JSON.parse(data)
        } catch (e) {
          return reject(new Error(`Error when parsing json. Data : ${data}`))
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
        return resolve({ url: data.link, data })
      })
    })

    request.on('error', err => reject(err))

    request.end() // let request know it is finished sending
  })
}

module.exports.getDebirdUrl = async function getDebirdUrl(urlToDebrid) {
  let cookie

  // Get cookie from HDD or Web
  try {
    cookie = await getAuthCookie(false)
  } catch (e) {
    throw new Error("Don't manage to get cookie")
  }

  // Try Get url
  try {
    return await getDebridUrlHandler({
      urlToDebrid,
      cookies: cookie
    })
  } catch (e) {
    try {
      // Get cookie from Web
      cookie = await getAuthCookie(true)

      // Get url
      return await getDebridUrlHandler({
        urlToDebrid,
        cookies: cookie
      })
    } catch (e) {
      throw new Error("Don't manage to get Url")
    }
  }
}
