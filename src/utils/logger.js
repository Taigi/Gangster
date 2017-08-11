module.exports = {
  log: function (prefix, val) {
    return console.log('\x1b[1m\u001b[32m[' + (prefix ? prefix : 'Info: ') + ']\x1b[0m ' + val)
  }
}
