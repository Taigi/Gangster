// Required
const config = require('./config.json')
const Discord = require('discord.js')

// Create sharder
const sharder = new Discord.ShardingManager('./src/shard.js', {'totalShards': config.Constants.shards, 'token': config.token}, false)

// Create shards using the sharder
for (let i = 0; i < config.Constants.shards; i++) {
  sharder.createShard(i)
}

// On exit
process.on('exit', () => {
  sharder.broadcastEval('process.exit()')
})
