exports.data = {
  'name': 'Invite',
  'desc': 'Here is my invite link! So you can invite me to wherever you want!',
  'usage': 'invite'
}

exports.run = function(msg, data) {

  // Create embed
  let embed = {
    'description': 'You van invite Gangster by clicking [**here**](https://discordapp.com/oauth2/authorize?client_id=344572704956874762&scope=bot)',
    'color': utils.misc.embedColor(msg),
    'timestamp': new Date(),
    'footer': {
      'text': '© Gangster'
    }
  }

  // Send embed
  msg.channel.send({embed})
}
