'use strict';

const device = 'NAD_SR6';

const lircNode = require('lirc_node');

let remotesAvaible = false;

lircNode.init(
  () => {
    if (!Object.keys(lircNode.remotes).length || JSON.stringify(lircNode.remotes).indexOf('command not found') >= 0 ) {
      console.error('remoteApp : May be you have an LIRC issue. No Remote Avaible');
      remotesAvaible = false;
    } else {
      //@todo change lirc_node to know when it ready.
      setTimeout( () => {
          console.info('remoteApp : remotes and commands avaible in LIRC');
          console.info(lircNode.remotes);
          remotesAvaible = true;
         }
      , 500);
    }
  }
);

exports.toDo = function (req, res, next) {

  let command = req.params.toDo;

  if (!remotesAvaible){
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
