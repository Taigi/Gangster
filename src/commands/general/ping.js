exports.data = {
  'name': 'Ping',
  'aliases': ['pong', 'latency'],
  'desc': 'This command shows the latency between the bot and Discord.',
  'usage': 'ping'
}

exports.run = function(msg, data) {
  let date = new Date()
  msg.channel.send('...').then((Msg) => {
    Msg.edit('Pong! (' + (new Date() - date) + 'ms)')
  })
}
