const device = 'NAD_SR6'

const lircNode = require('./lirc_node/lib/lirc_node')

let remotesAvaible = false

lircNode.init(() => {
  if (
    !Object.keys(lircNode.remotes).length ||
    JSON.stringify(lircNode.remotes).indexOf('command not found') >= 0
  ) {
    console.error(
      'remoteApp : May be you have an LIRC issue. No Remote Avaible'
    )
    remotesAvaible = false
  } else {
    // @todo change lirc_node to know when it ready.
    setTimeout(() => {
      console.info('remoteApp : remotes and commands avaible in LIRC')
      console.info(lircNode.remotes)
      remotesAvaible = true
    }, 500)
  }
})

exports.cmd = function cmd(req, res) {
  const { cmd } = req.params

  if (!remotesAvaible) {
    res.status(500)
    return res.json({
      success: false,
      msg: 'No avaible remote. You have to config LIRC on the server'
    })
  }

  if (cmd === 'LIST') {
    lircNode.irsend.list(device, '', data => {
      console.log(`Sent ${data}`)
    })

    try {
      return res.json({
        success: true,
        msg: `GET LIST`
      })
    } catch (err) {
      res.status(500)
      return res.json({
        success: false,
        msg: 'error getting list'
      })
    }
  }

  try {
    lircNode.irsend.send_once(device, cmd, () => {
      console.log(`Sent ${cmd} to ${device}`)
    })

    return res.json({
      success: true,
      msg: `Sent ${cmd} to ${device}`
    })
  } catch (err) {
    res.status(500)
    return res.json({
      success: false,
      msg: 'error LIRC'
    })
  }
}
