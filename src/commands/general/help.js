exports.data = {
  'name': 'Help',
  'aliases': ['cmds', 'commands', '?'],
  'desc': 'This command shows all the other commands, and even some detailed information about them!',
  'usage': 'help [command]'
}

exports.run = function(msg, data) {

  // Check if a suffix is not present
  if (!data.suffix) {

    // Setup message
    let messageArray = []
    messageArray.push('*For more information on these commands type `' + config.prefix + 'help [command]`*\n')

    // For each type of command
    for (let type in commands.all) {

      // Add a row for this type
      messageArray.push('__**' + commands.all[type].METADATA.name + '**__')
      let commandArray = []

      // Go trough every command that is inside this type except for metadata
      for (let command in commands.all[type]) {
        if (command != 'METADATA') {
          commandArray.push(commands.all[type][command].data.name)
        }
      }

      // Add the commands to the messageArray
      messageArray.push(commandArray.join(', ') + '\n')

    }

    // Create embed
    let embed = {
      'title': 'Gangster Commands!',
      'description': messageArray.join('\n'),
      'color': utils.misc.embedColor(msg),
      'timestamp': new Date(),
      'footer': {
        'text': '© Gangster'
      }
    }

    // Send embed
    msg.channel.send({embed})

  // Suffix is present.
  } else {

    if (commands.search[data.suffix.toLowerCase()]) {

      // Setup variables
      let command = commands.all[commands.search[data.suffix.toLowerCase()].type][commands.search[data.suffix.toLowerCase()].command].data
      let messageArray = []

      messageArray.push('*' + command.desc + '*\n')
      messageArray.push('► Usage: `' + command.usage + '`')


      // Create embed
      let embed = {
        'title': command.name,
        'description': messageArray.join('\n'),
        'color': utils.misc.embedColor(msg),
        'timestamp': new Date(),
        'footer': {
          'text': '(required) [optional] © Gangster'
        }
      }

      // Send embed
      msg.channel.send({embed})

    } else {
      msg.channel.send('Command does not exist!')
    }

  }

}
