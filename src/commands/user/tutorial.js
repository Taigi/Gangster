exports.data = {
  'name': 'Tutorial',
  'desc': 'Do the damned tutorial, punk! You cant even play without doing this...',
  'usage': 'tutorial'
}

let config = require('../../config.json')

exports.run = function(msg, data) {
  utils.db.getUser(msg.author).then((result) => {

    if (result.tutorial.status) {

      // Setup variables
      var messageArray = []

      // Switch trough the tutorial status
      switch (result.tutorial.stage) {

        // Account Created
        case 0:

          messageArray.push('**Tutorial Master:**')
          messageArray.push('Well then, now that you have some money we need you to use it! How about you start growing some **cannabis**.\n')

          messageArray.push('**Objective**')
          messageArray.push('*Type `' + config.prefix + 'produce` to see a list of all the available drugs for you! At this moment the only available drug is `cannabis`. You can type `' + config.prefix + 'produce info cannabis` to see more info about the different tiers. The tiers with an exclamation mark are to hard for you to produce yet!')
          messageArray.push('To start actually producing the `cannabis` you need to run the produce command like this: `' + config.prefix + 'produce start [drug] [tier]`. in this case you would need to fill it in like this: `' + config.prefix + 'produce start cannabis 1`. This will start the production of cannabis!')
          messageArray.push('For more information about these commands use the `help` command!*')

          result.tutorial.stage++
          utils.db.updateUser(msg.author, result).catch((err) => {throw err})
          sendEmbed()

        break;

        case 1:

          messageArray.push('**Tutorial Master:**')
          messageArray.push('You haven\'t done what i told you to do yet!\n')

          messageArray.push('**Objective**')
          messageArray.push('*Type `' + config.prefix + 'produce` to see a list of all the available drugs for you! At this moment the only available drug is `cannabis`. You can type `' + config.prefix + 'produce info cannabis` to see more info about the different tiers. The tiers with an exclamation mark are to hard for you to produce yet!')
          messageArray.push('To start actually producing the `cannabis` you need to run the produce command like this: `' + config.prefix + 'produce start [drug] [tier]`. in this case you would need to fill it in like this: `' + config.prefux + 'produce start cannabis 1`. This will start the production of cannabis!')
          messageArray.push('For more information about these commands use the `help` command!*')

          sendEmbed()

        break;

        // Started producing Cannabis
        case 2:

          messageArray.push('**Tutorial Master:**')
          messageArray.push('Good! Now that you are producing cannabis you can start to earn some hard cash. It takes 1 minute to grow cannabis, after that you can harvest it!\n')

          messageArray.push('**Objective**')
          messageArray.push('*Type `' + config.prefix + 'status` to see the status of all your productions! When the cannabis is ready, collect it with the `' + config.prefix + 'collect` command.')
          messageArray.push('If you need more help on how to use the `status` or `produce` command, you can type `' + config.prefix + 'help status` or `' + config.prefix + 'help produce`. This will show you all information you need to use that command.*')

          result.tutorial.stage++
          utils.db.updateUser(msg.author, result).catch((err) => {throw err})
          sendEmbed()

        break;
        case 3:
          messageArray.push('**Tutorial Master:**')
          messageArray.push('You haven\'t done what i told you to do yet!\n')

          messageArray.push('**Objective**')
          messageArray.push('*Type `' + config.prefix + 'status` to see the status of all your productions! When the cannabis is ready, collect it with the `' + config.prefix + 'collect` command.')
          messageArray.push('If you need more help on how to use the `status` or `produce` command, you can type `' + config.prefix + 'help status` or `' + config.prefix + 'help produce`. This will show you all information you need to use that command.*')

          sendEmbed()
        break;

        // Harvested cannabis
        case 4:
          messageArray.push('**Tutorial Master:**')
          messageArray.push('Now that you have your hard earned drugs! You can sell them!\n')

          messageArray.push('**Objective**')
          messageArray.push('*To sell a drug you can type `' + config.prefix + 'sell (drug) (amount)`.')
          messageArray.push('To check the current price of a drug you can type `' + config.prefix + 'economy`*')

          result.tutorial.stage++
          utils.db.updateUser(msg.author, result).catch((err) => {throw err})
          sendEmbed()
        break;

        // Default
        default:

          messageArray.push('**Tutorial Master:**')
          messageArray.push('Good to see you back! I can see you have not done what i told you to do yet... Go on! Do your stuff **punk**!')

          sendEmbed()

        break;
      }

      function sendEmbed() {

        // Create embed
        let embed = {
          'description': messageArray.join('\n'),
          'color': utils.misc.embedColor(msg),
          'timestamp': new Date(),
          'footer': {
            'text': '© Gangster'
          }
        }

        // Send Embed
        msg.channel.send({embed})

      }

    } else {
      msg.channel.send('You already finished the tutorial! Go out there and be the biggest gangster there is!')
    }

  }).catch((err) => {
    if (err == 'User Does Not Exist') {

      let messageArray = []
      messageArray.push('**Tutorial Master:**')
      messageArray.push('Yo **punk**! It looks like you don\'t know shit about this world you are going to enter! To start your illegal adventure you first have to do some things.\n')
      messageArray.push('**Objective**')
      messageArray.push('*To continue the tutorial type `' + config.prefix + 'stats`*')

      // Create embed
      let embed = {
        'description': messageArray.join('\n'),
        'color': utils.misc.embedColor(msg),
        'timestamp': new Date(),
        'footer': {
          'text': '© Gangster'
        }
      }

      msg.channel.send({embed})
    } else {
      throw err
    }
  })
}
