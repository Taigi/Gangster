exports.data = {
  'name': 'Collect',
  'desc': 'Uset his command to collect your drugs!',
  'usage': 'collect [drug]'
}

const produce = require('../../constants/produce.json')
const lodash = require('lodash')

exports.run = function(msg, data) {
  utils.db.getUser(msg.author).then((user) => {

    if (user.productions.length > 0) {
      let collect = 0
      let messageArray = []
      let grades = {
        "horrible": 0.5,
        "bad": 0.75,
        "normal": 1,
        "good": 1.25,
        "awesome": 1.5
      }

      for (let i in user.productions) {
        if (user.productions[i].start + user.productions[i].product.time - Date.now() <= 0) {

          // Full Production Object
          let product = produce[user.productions[i].product.name.toLowerCase()].production[user.productions[i].product.tier]

          collect++

          let grade = Math.floor(Math.random() * 100) + 1
          if (grade <= 5) {
            grade = {'multiplier': grades.horrible, 'name': 'Horrible'}
          } else if (grade <= 25) {
            grade = {'multiplier': grades.bad, 'name': 'Bad'}
          } else if (grade <= 75) {
            grade = {'multiplier': grades.normal, 'name': 'Normal'}
          } else if (grade <= 95) {
            grade = {'multiplier': grades.good, 'name': 'Good'}
          } else {
            grade = {'multiplier': grades.awesome, 'name': 'Awesome'}
          }
          let reward = Math.floor(grade.multiplier * (Math.random() * (product.reward.max - product.reward.min + 1)) + product.reward.min)

          messageArray.push('**' + user.productions[i].product.name + ' (Tier ' + user.productions[i].product.tier + ')**')
          messageArray.push('► Multiplier: **' + grade.name + ' (' + grade.multiplier + 'x)**')
          messageArray.push('► Reward: **' + reward + ' ' + produce[user.productions[i].product.name.toLowerCase()].format + '**!')

          let inventoryObject = user.inventory.find(o => o.type == user.productions[i].product.name.toLowerCase())

          if (inventoryObject) {
            inventoryObject.amount += reward
          } else {
            user.inventory.push({'type': user.productions[i].product.name.toLowerCase(), 'amount': reward})
          }

          // Add xp
          let xp = Math.floor(Math.random() * (user.mainAttributes.lvl * 50 * user.productions[i].product.tier))
          if (user.mainAttributes.lvl > 1) {
            xp += user.mainAttributes.lvl * 50 * user.productions[i].product.tier
          }
          user.mainAttributes.xp += xp
          messageArray.push('► Xp Reward: **' + xp + 'XP**')

          user.productions.splice(i, 1)
        }
      }

      if (collect > 0) {

        let lvlCheck = utils.misc.checklvl(user)
        if (lvlCheck.lvlUp) {
          user = lvlCheck.user
          messageArray.push('\n**Level Up! You are now level ' + user.mainAttributes.lvl + '!** :tada:')
        }

        if (user.tutorial.status) {
          if (user.tutorial.stage == 3) {
            messageArray.push('\n**Objective**')
            messageArray.push('*Type `' + config.prefix + 'tutorial` to continue the tutorial!*')
            user.tutorial.stage++
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

      } else {
        msg.channel.send('Your productions are not ready to be collected yet!')
      }

    } else {
      msg.channel.send('You do not have any productions to collect!')
    }

  }).catch((err) => {
    if (err == 'User Does Not Exist') {
      msg.channel.send('It seems like you have not started your adventure! Please type `' + config.prefix + 'tutorial` to start!')
    } else {
      throw err
    }
  })
}
