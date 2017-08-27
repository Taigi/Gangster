const economyConstant = require('../constants/economy.json')

exports.updateEconomy = function(drug, amount) {
  utils.db.getEconomy().then((economy) => {

    for (let i in economy) {
      if (economy[i].drug == drug.toLowerCase()) {
        economy[i].multiplier = economy[i].multiplier * Math.pow(config.Constants.economy.negativeModifier, amount)
      } else {
        economy[i].multiplier = economy[i].multiplier * Math.pow(config.Constants.economy.positiveModifier, amount)
      }

      if (economy[i].multiplier > 2) {
        economy[i].multiplier = 2
      } else if (economy[i].multiplier < 0.5) {
        economy[i].multiplier = 0.5
      }

      economy[i].price = Math.round(economy[i].basePrice * economy[i].multiplier)
    }


    utils.db.updateEconomy(economy).catch((err) => {throw err})

  }).catch((err) => {
    throw err
  })
}

exports.sell = function(user, drug, amount, callback) {
  utils.db.getEconomy().then((economy) => {
    let drugEconomy = economy.find(o => o.drug == drug)
    let xp = Math.floor(user.mainAttributes.lvl / 2 * (drugEconomy.price * amount) / 100)

    exports.updateEconomy(drug, amount)

    user.mainAttributes.cash += drugEconomy.price * amount
    user.mainAttributes.xp += xp
    let inventoryObject = user.inventory.find(o => o.type == drug)
    inventoryObject.amount -= amount
    if (inventoryObject.amount <= 0) {
      let index = user.inventory.findIndex(o => o.type == drug)
      user.inventory.splice(index, 1)
    }

    callback(user, drugEconomy.price * amount, xp)
  })
}
