exports.data = {
  'name': 'Economy',
  'desc': 'This command shows you how the current economy is coming along!',
  'usage': 'economy'
}

const produce = require('../../constants/produce.json')
let lastPrices = {'cannabis': 10, 'hashish': 30}

exports.run = function(msg, data) {
  utils.db.getEconomy().then((economy) => {

    // Setup variables
    let messageArray = []

    for (let drug of economy) {
      if (lastPrices[drug.drug] != drug.price) {
        lastPrices[drug.drug] = drug.price
      }
      if (drug.price > lastPrices[drug.drug]) {
        messageArray.push(':arrow_up_small: **' + produce[drug.drug].name + ' - ' + drug.price + '$**')
      } else if (drug.price < lastPrices[drug.drug]) {
        messageArray.push(':arrow_down_small: **' + produce[drug.drug].name + ' - ' + drug.price + '$**')
      } else {
        messageArray.push(':pause_button: **' + produce[drug.drug].name + ' - ' + drug.price + '$**')
      }
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
    throw err
  })
}
