const baseUrl = 'http://localhost:8085/'
const apiUrl = `${baseUrl}api/remoteApp/`

const lircClient = (function lircClient(document, window) {
  // //////////////////////////////////
  // / Private
  // //////////////////////////////////
  function sendCmd(cmd, cb) {
    window.console.log(cmd)

    const xhr = new window.XMLHttpRequest()
    let reponse = {}

    xhr.onreadystatechange = function onReadyStateChange() {
      if (xhr.readyState === 4) {
        try {
          reponse = JSON.parse(xhr.responseText)
        } catch (e) {
          window.console.log('Api error')
        }

        if (xhr.status === 500) {
          window.alert(reponse.msg)
        }
        if (cb) cb(reponse)
      }
    }

    xhr.open('GET', `${apiUrl}${cmd}`, true)
    xhr.send(null)
  }

  function addRepeatClick(input, cmd) {
    let interval
    let count = 0
    const speed = 500

    input.addEventListener('mousedown', () => {
      interval = setInterval(() => {
        count++
        sendCmd(cmd)
        if (count > 10) {
          clearInterval(interval)
          count = 0
        }
      }, speed)
    })

    input.addEventListener('mouseup', () => {
      sendCmd(cmd)
      clearInterval(interval)
    })
  }

  function addClick(input, cmd) {
    input.addEventListener('click', () => {
      sendCmd(cmd)
      return true
    })
  }

  function isEmpty(str) {
    return str && str.length === 0
  }

  function addListener(input) {
    const { cmd, mode } = input.dataset

    if (!isEmpty(cmd)) {
      if (!isEmpty(mode) && mode === 'repeat') {
        return addRepeatClick(input, cmd)
      }
      return addClick(input, cmd)
    }
    return true
  }

  // //////////////////////////////////
  // / Public
  // //////////////////////////////////
  function addListeners() {
    const inputs = document.querySelectorAll('button')

    for (let i = 0, l = inputs.length; i < l; i++) {
      addListener(inputs[i])
    }
  }

  return { addListeners }
})(document, window)

// DOM is ready
window.addEventListener('load', lircClient.addListeners)
