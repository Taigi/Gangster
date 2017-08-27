exports.data = {
  'name': 'Test',
  'desc': 'This command is used to test new commands and test systems.',
  'usage': 'test [Stuff? Mayby?]'
}

exports.run = function(msg, data) {
  if (data.suffix) {
    if (data.suffix.toLowerCase() == 'new') {
      let date = new Date()
      utils.db.newUser(msg.author).then((result) => {
        let time = new Date() - date
        msg.channel.send(time + 'ms\n```js\n' + JSON.stringify(result, null, 2) + '```')

        console.log(JSON.stringify(result, null, 2))
      }).catch((err) => {
        if (err == 'User Already Exists') {
          msg.channel.send(err)
        } else {
          throw err
        }
      })
    } else if (data.suffix.toLowerCase() == 'get') {
      let date = new Date()
      utils.db.getUser(msg.author).then((result) => {
        let time = new Date() - date
        msg.channel.send(time + 'ms\n```js\n' + JSON.stringify(result, null, 2) + '```')

        console.log(JSON.stringify(result, null, 2))
      }).catch((err) => {
        if (err == 'User Does Not Exist') {
          msg.channel.send(err)
        } else {
          throw err
        }
      })
    } else if (data.suffix.toLowerCase() == 'del') {
      let date = new Date()
      utils.db.delUser(msg.author).then((result) => {
        let time = new Date() - date
        msg.channel.send(time + 'ms\n```js\n' + JSON.stringify(result, null, 2) + '```')

        console.log(JSON.stringify(result, null, 2))
      })
    } else if (data.suffix.toLowerCase() == 'update') {
      let date = new Date()
      utils.db.getUser(msg.author).then((result) => {
        result.mainAttributes.cash += 42
        utils.db.updateUser(msg.author, result).then((result) => {
          let time = new Date() - date
          msg.channel.send(time + 'ms\n```js\n' + JSON.stringify(result, null, 2) + '```')

          console.log(JSON.stringify(result, null, 2))
        }).catch((err) => {
          throw err
        })
      })
    } else if (data.suffix.split(' ')[0].toLowerCase() == 'givexp') {
      let xp = parseInt(data.suffix.split(' ')[1])
      utils.db.getUser(msg.author).then((result) => {
        result.mainAttributes.xp += xp
        let lvlCheck = utils.misc.checklvl(result)
        if (lvlCheck.lvlUp) {
          result = lvlCheck.user
          utils.db.updateUser(msg.author, result).then((result) => {
            msg.channel.send('LEVEL UP!')
          }).catch((err) => {
            throw err
          })

        } else {
          utils.db.updateUser(msg.author, result).then((result) => {
            msg.channel.send('Not Level Up')

          }).catch((err) => {
            throw err
          })
        }
      }).catch((err) => {
        throw err
      })
    }
  }
}
