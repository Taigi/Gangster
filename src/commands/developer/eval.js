exports.data = {
  'name': 'Eval',
  'aliases': ['evaluate', 'program', 'bitchplz'],
  'desc': 'Evaluate some code baby boy! :fire:',
  'usage': 'eval (code)'
}

exports.run = function(msg, data) {

  if (data.suffix) {

    msg.channel.send('Evaluating...').then((Msg) => {

      try {

        let result = eval(data.suffix)

        if (typeof result !== 'object') {

          // Create embed
          let embed = {
            'color': 0x00FF00,
            'timestamp': new Date(),
            'fields': [
              {
                'name': 'Input',
                'value': '```js\n' + data.suffix + '```'
              },
              {
                'name': 'Output',
                'value': '```js\n' + result + '```'
              }
            ]
          }

          // Send embed
          msg.channel.send({embed})

        } else {

          // Create embed
          let embed = {
            'color': 0x00FF00,
            'timestamp': new Date(),
            'fields': [
              {
                'name': 'Input',
                'value': '```js\n' + data.suffix + '```'
              },
              {
                'name': 'Output',
                'value': '```json\n' + result + '```'
              }
            ]
          }

          // Send embed
          msg.channel.send({embed})

        }
      } catch(err) {

        // Create embed
        let embed = {
          'color': 0xFF0000,
          'timestamp': new Date(),
          'fields': [
            {
              'name': 'Input',
              'value': '```js\n' + data.suffix + '```'
            },
            {
              'name': 'Output',
              'value': '```json\n' + err + '```'
            }
          ]
        }

        // Send embed
        msg.channel.send({embed})

      }
    })
  } else {
    msg.channel.send('No suffix.')
  }
}
