const r = require('rethinkdb')
const config = require('../config.json')
let connection

r.connect({
  'host': config.database.host,
  'port': config.database.port
}, function(err, conn) {
  if (err) throw err
  connection = conn
})

exports.initialize = function() {
  return new Promise((resolve, reject) => {
    connection.use(config.database.dbName)
    resolve()
  })
}

exports.newUser = function(user) {
  return new Promise((resolve, reject) => {

    // Check if user already exists
    r.table('users').filter({'discordId': user.id}).run(connection, function(err, cursor) {
      if (err) console.log(err)
      cursor.toArray(function(err, result) {
        if (err) reject(err)

        // Check if user already exists
        if (result.length > 0) {
          reject('User Already Exists')
        } else {

          // Setup data object
          let data = {
            'discordId': user.id,
            'mainAttributes': {
              'cash': 1000,
              'diamonds': 25,
              'lvl': 1,
              'xp': 0,
              'xpToNextLevel': 100
            },
            'gameplayAttributes': {
              'maxProduce': 1,
              'xpMultiplier': 1
            },
            'tutorial': {
              'status': true,
              'stage': 0
            },
            'productions': [],
            'inventory': []
          }

          // Insert user data into the users table
          r.table('users').insert([data]).run(connection, function(err, result) {
            if (err) reject(err)
            resolve(result, data)
          })
        }
      })
    })
  })
}

exports.getUser = function(user) {
  return new Promise((resolve, reject) => {

    // Get current user
    r.table('users').filter({'discordId': user.id}).run(connection, function(err, cursor) {

      // Change cursor to an array
      cursor.toArray(function(err, result) {
        if (err) reject(err)

        // Check if there are any results
        if (result.length > 0) {
          resolve(result[0])
        } else {
          reject('User Does Not Exist')
        }
      })
    })

  })
}

exports.updateUser = function(user, object) {
  return new Promise((resolve, reject) => {

    // Get user and check if user is existent
    r.table('users').filter({'discordId': user.id}).update(object).run(connection, function(err, result) {
      if (err) reject(err)

      // Check if any user got updated
      if (result.replaced == 0) {
        reject('User Not Updated')
      } else {
        resolve(result)
      }
    })

  })

}

exports.delUser = function(user) {
  return new Promise((resolve, reject) => {

    // Get current user and delete it
    r.table('users').filter({'discordId': user.id}).delete().run(connection, function(err, result) {
      if (err) reject(err)

      // Check if any users got deleted
      if (result.deleted == 0) {
        reject('User Not Deleted')
      } else {
        resolve(result)
      }
    })
  })
}

exports.getEconomy = function() {
  return new Promise((resolve, reject) => {

    r.table('economy').run(connection, function(err, cursor) {
      if (err) reject(err)

      cursor.toArray(function(err, result) {
        if (err) reject(err)

        resolve(result)
      })
    })
  })
}

exports.updateEconomy = function(economy) {
  return new Promise((resolve, reject) => {

    r.table('economy').delete().run(connection, function(err, result) {
      if (err) reject(err)
      r.table('economy').insert(economy).run(connection, function(err, result) {
        if (err) reject(err)

        resolve(result)
      })
    })
  })
}
