exports.data = {
  'name': 'Status',
  'desc': 'You can see the status of your productions with this command! How wonderfull!',
  'usage': 'status'
}

exports.run = function(msg, data) {
  utils.db.getUser(msg.author).then((user) => {

    // Setup variables
    let messageArray = []

    if (user.productions.length > 0) {

      for (let product of user.productions) {

        let timeBarWidth = 30
        let timeLeftMs = product.start + product.product.time - Date.now()
        let timeBarCount = Math.floor(timeLeftMs / product.product.time * timeBarWidth)

        if (timeLeftMs > 0) {
          messageArray.push('**' + product.product.name + ' (Tier ' + product.product.tier + ') **- ' + '█'.repeat(timeBarWidth - timeBarCount) + '▒'.repeat(timeBarCount))
          messageArray.push(' '.repeat(product.product.name.length * 2.75 + 15 + product.product.tier.length) + '└─ ** ' + utils.misc.timeLeft(timeLeftMs) + ' left ** ─┘\n')
        } else {
          messageArray.push('**' + product.product.name + ' (Tier ' + product.product.tier + ') ** - **FINISHED**\n')
        }

      }

    } else {
      messageArray.push('**There are no active productions.**')
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

    msg.channel.send({embed})

  }).catch((err) => {
    if (err == 'User Does Not Exist') {
      msg.channel.send('It seems like you have not started your adventure! Please type `' + config.prefix + 'tutorial` to start!')
    } else {
      throw err
    }
  })
}
