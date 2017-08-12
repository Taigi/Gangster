// Setup variables

const fs = require('fs')

let started = false
let startup = new Date()

let shard = parseInt(process.env['SHARD_ID'], 16)
let shards = parseInt(process.env['SHARD_COUNT'], 16)

// Logging
global.utils = {
  'misc': require('./utils/misc.js'),
  'logger': require('./utils/logger.js')
}
utils.logger.log('Shard: ' + shard, 'Spawned Process')

// Setup bot
global.config = require('./config.json')
const Discord = require('discord.js')
global.bot = new Discord.Client({
  'shardId': shard,
  'shardCount': shards
})

// When bot is fully logged in
bot.on('ready', () => {
  utils.logger.log('Shard: ' + shard, 'Ready with ' + bot.guilds.size + ' ' + (bot.guilds.size > 1 ? 'guilds' : 'guild') + ' (' + (new Date() - startup) + 'ms)')
  startupFunction()
})

// Startup/loading everything
function startupFunction() {

  // Load commands
  loadCommands(function(commands) {
    utils.logger.log('Shard: ' + shard, 'Loaded ' + commands.count + ' ' + (commands.count > 1 ? 'commands' : 'command'))
    global.commands = commands
    started = true
  })

}

// Message Handleing
bot.on('message', (msg) => {

  // Validate Message
  if (validateMessage(msg)) {

    let commandName = msg.content.substr(config.prefix.length).split(' ')[0].toLowerCase()

    if (commands.search[commandName]) {

      let data = {'suffix': msg.content.substr(config.prefix.length).substr(msg.content.substr(config.prefix.length).split(' ')[0].length + 1)}
      let command = commands.all[commands.search[commandName].type][commands.search[commandName].command]

      if (validateUser(msg, command)) {

        command.run(msg, data)
        utils.logger.log('Shard: ' + shard, '\x1b[32m' + msg.author.tag + '\x1b[0m ran the \x1b[32m' + commandName + '\x1b[0m command')

      }

    }

  }

})

// Log into the bot
bot.login(process.env['TOKEN'])

// Functions
// Message Validation
function validateMessage(msg) {

  // Start check
  if (!started) return false

  // Prefix check
  if (!msg.content.startsWith(config.prefix)) return false

  // Bot check
  if (msg.author.bot) return false

  // Direct message check
  if (msg.channel.type == 'dm') return false

  //Message validated
  return true

}

function validateUser(msg, command) {

  // Check developer
  if (commands.search[command.data.name.toLowerCase()].type == 'developer') {
    if (config.master.indexOf(msg.author.id) == -1) {
      return false
    }
  }

  // User is validated and may use this command
  return true

}

// Load Commands
function loadCommands(callback) {

  // Setup variables
  let directories = fs.readdirSync(__dirname + '/commands')
  let commands = {'search': {}, 'all': {}, 'count': 0}

  // Go trough every directory inside the commands folder
  for (let directory of directories) {

    let commandFiles = fs.readdirSync(__dirname + '/commands/' + directory)

    // Go trough every file inside a directory
    for (let commandFile of commandFiles) {

      // Only .js files allowed
      if (commandFile.endsWith('.js')) {

        if (!commands.all[directory]) {
          commands.all[directory] = {}
        }

        // Setup the command to be accesable
        try {

          let command = require(__dirname + '/commands/' + directory + '/' + commandFile)

          commands.all[directory][commandFile.slice(0, -3).toLowerCase()] = command
          commands.search[commandFile.slice(0, -3).toLowerCase()] = {'command': commandFile.slice(0, -3).toLowerCase(), 'type': directory}
          commands.count++

          // Setup aliases
          if (command.data.aliases) {

            for (let alias of command.data.aliases) {
              commands.search[alias] = {'command': commandFile.slice(0, -3).toLowerCase(), 'type': directory}
            }

          }

        } catch(err) {
          throw(err)
        }

      } else if (commandFile == 'METADATA.json') {
        commands.all[directory].METADATA = require(__dirname + '/commands/' + directory + '/METADATA.json')
      }

    }

  }

  callback(commands)

}
