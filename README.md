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

# Use the app

First you need to change the device in /controllers/remoteApp.controllers.js

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

Go to [http://localhost:5000](http://localhost:5000).

# Add some command

You just need to add button on the pug template (/views/index.pug)

```
      button(type='button' class='btn btn-red' data-cmd='KEY_MUTE')
        span(class="icon-volume-mute")
```

Replace KEY_MUTE by a valid command (cf your lircd.conf)

## License

Copyright © 2015 [Marc Foletto](https://github.com/marc31)
Released under the GPL-3.0 license.
