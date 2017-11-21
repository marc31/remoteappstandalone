'use strict';

const device = 'NAD_SR6';

const debug = require('debug')('remoteAppStandalone:server');

const lircNode = require('lirc_node');

lircNode.init();

const remotesAvaible = JSON.stringify(lircNode.remotes);

// To see all of the remotes and commands that LIRC knows about

if (remotesAvaible || remotesAvaible.length === 0){
  debug('remoteApp : You have LIRC issue. No remote avaible');
} else {
  debug('remoteApp : remote avaible in LIRC' + remotesAvaible);
}

exports.toDo = function (req, res, next) {

  let command = req.params.toDo;

  if (remotesAvaible || remotesAvaible.length === 0){
    res.status(500);
    return res.json({
      success: false,
      msg: 'You have to config LIRC on the server'
    });
  }

  try {
    lircNode.irsend.send_once(device, req.params.toDo, function() {
      console.log(`Sent ${command} to ${device}`);
    });

    res.json({
      success: true,
      msg: `Sent ${command} to ${device}`
    });

  }catch(err){

    res.status(500);
    res.json({
      success: false,
      msg: 'error LIRC'
    });

  }

};
