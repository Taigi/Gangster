exports.data = {
  'name': 'Produce',
  'desc': 'With this command you can start producing your drugs!',
  'usage': 'produce [info, start] [drug] [tier]'
}

const produce = require('../../constants/produce.json')

exports.run = function(msg, data) {

  // Check if suffix
  if (data.suffix) {
    if (data.suffix.split(' ')[0].toLowerCase() == 'info') {
      if (produce[data.suffix.substr(data.suffix.indexOf(" ") + 1).toLowerCase()]) {
        utils.db.getUser(msg.author).then((user) => {

          let messageArray = []
          let drug = produce[data.suffix.substr(data.suffix.indexOf(" ") + 1).toLowerCase()]

          for (let tier in drug.production) {
            if (drug.production[tier].minlvl <= user.mainAttributes.lvl) {
              messageArray.push('**Tier ' + tier + ' (Minimum Level: ' + drug.production[tier].minlvl + ')**')
            } else {
              messageArray.push('**Tier ' + tier + ' (Minimum Level: ' + drug.production[tier].minlvl + ')** :exclamation:')
            }
            messageArray.push('►　Cost: **' + drug.production[tier].cost + '$**')
            messageArray.push('►　Reward: **' + drug.production[tier].reward.min + '/' + drug.production[tier].reward.max + ' gram**')
            messageArray.push('►　Time: **' + (drug.production[tier].time / 60000) + 'min**\n')
          }

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

      } else {
        msg.channel.send('Invalid Drug')
      }
    } else if (data.suffix.split(' ')[0].toLowerCase() == 'start') {

      let split = data.suffix.split(' ')
      let drug = split.slice(1, split.length - 1).join(' ').toLowerCase()
      let tier = split.pop()

      if (produce[drug]) {
        if (produce[drug].production[tier]) {
          utils.db.getUser(msg.author).then((user) => {

            if (user.mainAttributes.lvl >= produce[drug].production[tier].minlvl) {

              if (user.productions.length < user.gameplayAttributes.maxProduce) {

                if (user.mainAttributes.cash >= produce[drug].production[tier].cost) {

                  // Setup Production
                  let production = {
                    'start': Date.now(),
                    'product': {
                      'name': produce[drug].name,
                      'tier': tier,
                      'time': produce[drug].production[tier].time
                    }
                  }

                  user.productions.push(production)
                  user.mainAttributes.cash -= produce[drug].production[tier].cost

                  let messageArray = []

                  if (user.tutorial.status) {
                    if (user.tutorial.stage == 1) {
                      if (drug == 'cannabis') {

                        user.tutorial.stage++
                        messageArray.push('Started your **' + produce[drug].name + ' (Tier ' + tier + ')** production!')
                        messageArray.push('This costed you a whopping **' + produce[drug].production[tier].cost + '$**!')

                        messageArray.push('\n**Objective**')
                        messageArray.push('*Type `' + config.prefix + 'tutorial` to continue the tutorial!*')

                        let embed = {
                          'description': messageArray.join('\n'),
                          'color': utils.misc.embedColor(msg),
                          'timestamp': new Date(),
                          'footer': {
                            'text': '© Gangster'
                          }
                        }

                        utils.db.updateUser(msg.author, user).then(() => {
                          msg.channel.send({embed})
                        }).catch((err) => {
                          throw err
                        })

                      } else {
                        msg.channel.send('That is the wrong drug **punk**! Use `cannabis`!')
                      }
                    } else {
                      msg.channel.send('Please finish the tutorial before you can continue.')
                    }
                  } else {
                    messageArray.push('Started your **' + produce[drug].name + ' (Tier ' + tier + ')** production!')
                    messageArray.push('This costed you a whopping **' + produce[drug].production[tier].cost + '$**!')

                    let embed = {
                      'description': messageArray.join('\n'),
                      'color': utils.misc.embedColor(msg),
                      'timestamp': new Date(),
                      'footer': {
                        'text': '© Gangster'
                      }
                    }

                    utils.db.updateUser(msg.author, user).then(() => {
                      msg.channel.send({embed})
                    }).catch((err) => {
                      throw err
                    })
                  }

                } else {
                  msg.channel.send('You do not have enough cash!')
                }

              } else {
                msg.channel.send('You are already at your maximum production rate! You cant start any more productions until your old ones finish!')
              }

            } else {
              msg.channel.send('You are not a high enough level to start producing this drug!')
            }

          }).catch((err) => {
            if (err == 'User Does Not Exist') {
              msg.channel.send('It seems like you have not started your adventure! Please type `' + config.prefix + 'tutorial` to start!')
            } else {
              throw err
            }
          })

        } else {
          msg.channel.send('Invalid Tier')
        }

      } else {
        msg.channel.send('Invalid Drug')
      }

    } else {
      msg.channel.send('Invalid Suffix')
    }
  } else {

    utils.db.getUser(msg.author).then((user) => {

      // Tutorial Phase
      if (user.tutorial.status) {
        if (user.tutorial.stage == 1) {

          let embed = setupDrugList(user, msg)

          msg.channel.send({embed})

        } else if (user.tutorial.stage < 1) {
          msg.channel.send('You are not ready to do this part of the tutorial yet! To continue with the tutorial please type `' + config.prefix + 'tutorial`')
        } else {
          msg.channel.send('You already did this part of the tutorial! To continue with the tutorial please type `' + config.prefix + 'tutorial`')
        }
      } else {

        let embed = setupDrugList(user, msg)

        msg.channel.send({embed})

      }

    }).catch((err) => {
      if (err == 'User Does Not Exist') {
        msg.channel.send('It seems like you have not started your adventure! Please type `' + config.prefix + 'tutorial` to start!')
      } else {
        throw err
      }
    })

  }

}

function setupDrugList(user, msg) {
  let messageArray = []

  for (let drug in produce) {

    if (produce[drug].minlvl <= user.mainAttributes.lvl) {

      messageArray.push('__**' + produce[drug].name + '**__')
      messageArray.push('►　Minimum Level: **' + produce[drug].minlvl + '**')
      messageArray.push('►　Tier Count: **' + Object.keys(produce[drug].production).length + '**\n')

    }

  }

  return {
    'description': messageArray.join('\n'),
    'color': utils.misc.embedColor(msg),
    'timestamp': new Date(),
    'footer': {
      'text': '© Gangster'
    }
  }
}
