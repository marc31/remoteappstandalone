exports.version = '0.0.2'
exports.IRSend = require('./irsend')
exports.irsend = new exports.IRSend()
exports.remotes = {}

exports.IRReceive = require('./irreceive')
var irreceive = new exports.IRReceive()
exports.addListener = irreceive.addListener.bind(irreceive)
exports.on = exports.addListener
exports.removeListener = irreceive.removeListener.bind(irreceive)

// In some cases the default lirc socket does not work
// More info at http://wiki.openelec.tv/index.php?title=Guide_to_Lirc_IR_Blasting
exports.setSocket = function(socket) {
  exports.irsend.setSocket(socket)
}

exports.init = function(callback) {
  exports.irsend.list('', '', irsendCallback)

  function irsendCallback(error, stdout, stderr) {
    exports._populateRemotes(error, stdout, stderr)
    exports._populateCommands()
    if (callback) callback()
  }

  return true
}

// Private
exports._populateRemotes = function(error, stdout, stderr) {
  var remotes
  var remoteName

  exports.remotes = {}

  remotes = stderr.split('\n')
  remotes.forEach(function(element, index, array) {
    remoteName = element.match(/\s(.*)$/)
    if (
      remoteName &&
      remoteName[1] &&
      remoteName[1].indexOf('not found') < 0 &&
      remoteName[1].indexOf('error') < 0
    )
      exports.remotes[remoteName[1]] = []
  })

  remotes = stdout.split('\n')
  remotes.forEach(function(element, index, array) {
    remoteName = element.trim()
    if (
      remoteName &&
      remoteName.indexOf('not found') < 0 &&
      remoteName.indexOf('error')
    )
      exports.remotes[remoteName] = []
  })
}

exports._populateCommands = function() {
  for (var remote in exports.remotes) {
    ;(function(remote) {
      exports.irsend.list(remote, '', function(error, stdout, stderr) {
        exports._populateRemoteCommands(remote, error, stdout, stderr)
      })
    })(remote)
  }
}

exports._populateRemoteCommands = function(remote, error, stdout, stderr) {
  var commands = stderr.split('\n')

  commands.forEach(function(element, index, array) {
    var commandName = element.match(/\s.*\s(.*)$/)
    if (commandName && commandName[1])
      exports.remotes[remote].push(commandName[1])
  })
}
