exports.data = {
  'name': 'Sell',
  'desc': 'This command will add a 0 to your bank account!',
  'usage': 'sell (drug) (amount)'
}

exports.run = function(msg, data) {
  if (data.suffix) {
    let split = data.suffix.split(' ')
    let amount = parseInt(split[split.length - 1])
    let drug = split.slice(0, split.length - 1).join(' ')
    if (drug) {
      if (amount) {
        if (!isNaN(amount) && amount > 0) {

          utils.db.getUser(msg.author).then((user) => {

            if (user.inventory.length > 0) {

              let inventoryObject = user.inventory.find(o => o.type == drug.toLowerCase())
              if (inventoryObject) {
                if (amount <= inventoryObject.amount) {

                  utils.economy.sell(user, drug, amount, function(user, cash, xp) {
                    let messageArray = []

                    messageArray.push('**You sold your drugs!**')
                    messageArray.push('► Cash: **' + cash + '$**')
                    messageArray.push('► Xp Reward: **' + xp + 'XP**')

                    let lvlCheck = utils.misc.checklvl(user)
                    if (lvlCheck.lvlUp) {
                      user = lvlCheck.user
                      messageArray.push('\n**Level Up! You are now level ' + user.mainAttributes.lvl + '!** :tada:')
                    }

                    if (user.tutorial.status) {
                      if (user.tutorial.stage == 5) {
                        messageArray.push('\n**Tutorial Finished**')
                        messageArray.push('**You finished the tutorial!**')
                        user.tutorial.status = false
                      } else {
                        msg.channel.send('Please finish the tutorial before you can continue.')
                      }
                    }

                    utils.db.updateUser(msg.author, user).then((result) => {

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
                      throw err
                    })
                  })

                } else {
                  msg.channel.send('You do not have enough drugs to sell!')
                }
              } else {
                msg.channel.send('You do not have that type of drug on you!')
              }
            } else {
              msg.channel.send('You do not have any drugs to sell!')
            }

          }).catch((err) => {
            if (err == 'User Does Not Exist') {
              msg.channel.send('It seems like you have not started your adventure! Please type `' + config.prefix + 'tutorial` to start!')
            } else {
              throw err
            }
          })

        } else {
          msg.channel.send('Invalid Amount')
        }
      } else {
        msg.channel.send('No Amount Specified')
      }
    } else {
      msg.channel.send('Invalid Query')
    }
  } else {
    msg.channel.send('No suffix')
  }
}
