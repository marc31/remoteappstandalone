const baseUrl = 'http://192.168.1.51:8085/'
const apiUrl = `${baseUrl}api/remoteApp/`

// element for display server response
let servRespEl

// Var to cleanInterval used
// to sendings numbers of command
// when user keep the mouse btn down
let interval

function isEmpty(str) {
  return str && str.length === 0
}

// Send command to the api
function sendCmd(cmd) {
  console.log(cmd)

  servRespEl.innerHTML = ''

  fetch(`${apiUrl}${cmd}`)
    .then(res => {
      if (res.ok) {
        res.json().then(res => {
          servRespEl.innerHTML = `Status: ${res.success}. Msg: ${res.msg}`
          console.log(res)
        })
      } else {
        console.log('Mauvaise réponse du réseau')
      }
    })
    .catch(err =>
      console.log(
        `Il y a eu un problème avec l'opération fetch: ${err.message}`
      )
    )
}

// Attach event listener on btn
// to call number times the api
// when user mouse down
function addRepeatClick(input, cmd) {
  const speed = 500

  function preventDefaultClearInterval(e) {
    e.preventDefault()
    clearInterval(interval)
  }

  function repeatClickHelper(e) {
    preventDefaultClearInterval(e)
    sendCmd(cmd)
    interval = setInterval(() => {
      sendCmd(cmd)
    }, speed)
  }

  input.addEventListener('touchstart', repeatClickHelper, false)
  input.addEventListener('touchend', preventDefaultClearInterval, false)
  input.addEventListener('touchcancel', preventDefaultClearInterval, false)
  input.addEventListener('touchleave', preventDefaultClearInterval, false)

  input.addEventListener('mousedown', repeatClickHelper)
}

// Click event
function addClick(input, cmd) {
  input.addEventListener('click', () => {
    clearInterval(interval)
    sendCmd(cmd)
  })
}

let x = setInterval(() => console.log('salut'), 1000)
clearInterval(x)
clearInterval(x)

function addListener(input) {
  const { cmd, mode } = input.dataset
  if (!isEmpty(cmd)) {
    if (!isEmpty(mode) && mode === 'repeat') {
      addRepeatClick(input, cmd)
    }
    addClick(input, cmd)
  }
}

function addListeners() {
  const inputs = document.querySelectorAll('button')
  servRespEl = document.querySelector('#server-rps')
  for (let i = 0, l = inputs.length; i < l; i++) {
    addListener(inputs[i])
  }
}

window.addEventListener('mouseup', () => {
  clearInterval(interval)
})

window.addEventListener('load', addListeners)
