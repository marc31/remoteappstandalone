'use strict';

const lircClient = (function(document, window, undefined){

  ////////////////////////////////////
  /// Private
  ////////////////////////////////////
  function addRepeatClick(input, cmd) {
    let interval;
    let count = 0;
    const speed = 500;

    input.addEventListener( 'mousedown', function(e) {
        interval = setInterval( function(e){
          count++;
          sendCmd(cmd);
          if (count > 10){
            clearInterval(interval);
            count = 0;
          }
        }, speed);
      }
    );

    input.addEventListener( 'mouseup', function(e) {
        sendCmd(cmd);
        clearInterval(interval);
      }
    );
  }

  function addClick(input, cmd){
      input.addEventListener( 'click', function(e) {
          sendCmd(cmd);
        }
      );
  }

  function sendCmd(cmd, cb) {

    console.log(cmd);

    let xhr = new XMLHttpRequest();
    let rep = {};

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          rep = JSON.parse(xhr.responseText);
          if (xhr.status === 500) {
            alert(rep.msg);
          }
          if (cb) cb(rep);
        }
    };

    xhr.open('GET', '/api/remoteApp/' + cmd, true);
    xhr.send(null);
  }

  function isEmpty(str){
    return (str && str.length === 0);
  }

  function addListener(input) {
    let cmd = input.dataset.cmd,
        mode = input.dataset.mode;

    if (!isEmpty(cmd)) {
      if (!isEmpty(mode) && mode === 'repeat') {
        return addRepeatClick(input, cmd);
      }
      addClick(input, cmd);
    }

  }

  ////////////////////////////////////
  /// Public
  ////////////////////////////////////
  function addListeners() {

    let inputs = document.querySelectorAll('button');

    for (let i = 0, l = inputs.length ; i < l ; i++) {
      addListener(inputs[i]);
    }
  }

  return {
    addListeners: addListeners
  };

})(document, window);

// l'iframe est chargee
window.addEventListener('load', lircClient.addListeners);


