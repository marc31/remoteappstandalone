# remoteAppStandAlone

Web Application to communication with [LIRC](http://www.lirc.org) ( Linux Infrared Remote Control  )

# Requirements

* LIRC
* node.js
* yarn or npm

# Installation

```bash
$ yarn install
```

And if you want to start with your computer see /install/README.md


# Use the app

First you need to change the device in server/controllers/remoteApp.controllers.js

```js
const device = 'YOUR_DEVICE_NAME_IN_LIRC';
```

And in a terminal

For dev :
```bash
$ yarn run start
```

For production :
```bash
$ yarn run start-prod
```
If think is better for production to run for memory
```bash
$ NODE_ENV=production node ./server/server
```

Go to [http://localhost:8085](http://localhost:8085).

# Add some command

You just need to add button on the pug template (client/src/views/index.pug)

```
      button(type='button' class='btn btn-red' data-cmd='KEY_MUTE')
        span(class="icon-volume-mute")
```

Replace KEY_MUTE by a valid command (cf your lircd.conf)

# TODO
 
* Move client/src/sass/icomoon.scss to another directory
* Copy all favico to the server root with webpack
  
# License

Copyright © 2015 [Marc Foletto](https://github.com/marc31)
Released under the GPL-3.0 license.
