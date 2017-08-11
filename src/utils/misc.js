exports.embedColor = function(msg) {
  if (msg.channel.type == 'dm') {
    return 0xFFFFFF
  } else {
    return msg.guild.members.get(bot.user.id).highestRole.color
  }
}
