exports.data = {
  'name': 'Stats',
  'desc': 'This command shows you all your personal statistics!',
  'usage': 'stats [@user]'
}

const produce = require('../../constants/produce.json')

exports.run = function(msg, data) {

  // Setup variables
  let user = msg.author

  // Check if a user got mentioned
  if (msg.mentions.users.size > 0) {
    user = msg.mentions.users.first()
  }

  // Get user object
  utils.db.getUser(user).then((result) => {

    // Setup variables
    let messageArray = []

    // Calculate xp bar
    let xpBarWidth = 30
    let xpBarCount = Math.floor(result.mainAttributes.xp / result.mainAttributes.xpToNextLevel * xpBarWidth)

    messageArray.push('Lvl **' + result.mainAttributes.lvl + '** - ' + '█'.repeat(xpBarCount) + '▒'.repeat(xpBarWidth - xpBarCount) + ' - Lvl **' + (result.mainAttributes.lvl + 1) + '**')
    messageArray.push(' '.repeat(result.mainAttributes.lvl.toString().length * 2.5 + 10) + '└─ ** ' + result.mainAttributes.xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '/' + result.mainAttributes.xpToNextLevel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'XP** ─┘')

    messageArray.push('\n__**Finances**__')
    messageArray.push('► Cash: **' + result.mainAttributes.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '$**')
    messageArray.push('► Diamonds: **' + result.mainAttributes.diamonds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '**')

    messageArray.push('\n__**Attributes**__')
    messageArray.push('► Maximum Productions: **' + result.gameplayAttributes.maxProduce + '**')
    messageArray.push('► Experience Multiplier: **' + result.gameplayAttributes.xpMultiplier + '**')

    if (result.productions.length > 0) {
      messageArray.push('\n__**Current Productions**__')
      let productions = []
      for (let production of result.productions) {
        productions.push('► **' + production.product.name + '(Tier ' + production.product.tier + ')**')
      }
      messageArray.push(productions.join('\n'))
    }

    if (result.inventory.length > 0) {
      messageArray.push('\n__**Inventory**__')
      let inventory = []
      for (let item of result.inventory) {
        inventory.push('► **' + produce[item.type.toLowerCase()].name + ' (' + item.amount + ' ' + produce[item.type.toLowerCase()].format + ')**')
      }
      messageArray.push(inventory.join('\n'))
    }

    // Create embed
    let embed = {
      'description': messageArray.join('\n'),
      'color': utils.misc.embedColor(msg),
      'timestamp': new Date(),
      'footer': {
        'text': '© Gangster'
      }
    }

    // Send embed
    msg.channel.send(':bust_in_silhouette: **' + user.username + '\'s Statistics**', {embed})

  }).catch((err) => {
    if (err == 'User Does Not Exist') {

      msg.channel.send('Setting up your account...').then((Msg) => {
        utils.db.newUser(msg.author).then((result) => {

          let messageArray = []
          messageArray.push('**Tutorial Master:**')
          messageArray.push('So you really wanted to continue the journey into this illegal world? Well then, let\'s get started, **punk**! I have set you up with 1000$ cash and 25 diamonds.\n')
          messageArray.push('**Objective**')
          messageArray.push('*To continue the tutorial type `' + config.prefix + 'tutorial`*')

          // Create embed
          let embed = {
            'description': messageArray.join('\n'),
            'color': utils.misc.embedColor(msg),
            'timestamp': new Date(),
            'footer': {
              'text': '© Gangster'
            }
          }

          // Edit message with embed
          Msg.edit({embed})
        }).catch((err) => {
          throw err
        })
      })

    } else {
      throw err
    }
  })

}
