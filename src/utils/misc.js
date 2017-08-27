exports.embedColor = function(msg) {
  if (msg.channel.type == 'dm') {
    return 0xFFFFFF
  } else {
    return msg.guild.members.get(bot.user.id).highestRole.color
  }
}

exports.timeLeft = function(ms) {
  // Seconds
  if (ms < 60000) {
    let seconds = Math.floor(ms / 1000)
    return seconds + (seconds > 1 ? ' Seconds' : ' Second')
  // Minutes
  } else if (ms < 3600000) {
    let minutes = Math.floor(ms / 60000)
    return minutes + (minutes > 1 ? ' Minutes' : ' Minute')
  // Hours
  } else if (ms < 86400000) {
    let hours = Math.ceil(ms / 3600000)
    return hours + (hours > 1 ? ' Hours' : ' Hour')
  // Days
  } else {
    let days = Math.ceil(ms / 86400000)
    return days + (days > 1 ? ' Days' : ' Day')
  }
}

exports.checklvl = function(user) {
  if (user.mainAttributes.xp >= user.mainAttributes.xpToNextLevel) {

    let xpMultiplier = 1.2

    user.mainAttributes.xp -= user.mainAttributes.xpToNextLevel
    user.mainAttributes.xpToNextLevel = Math.floor(100 * Math.pow(1.2, user.mainAttributes.lvl))
    user.mainAttributes.lvl++
    if (user.mainAttributes.lvl / 5 % 1 != 0) {
      user.gameplayAttributes.maxProduce++
    }

    while (user.mainAttributes.xp >= user.mainAttributes.xpToNextLevel) {
      user.mainAttributes.xp -= user.mainAttributes.xpToNextLevel
      user.mainAttributes.xpToNextLevel = Math.floor(100 * Math.pow(1.2, user.mainAttributes.lvl))
      user.mainAttributes.lvl++
      if (user.mainAttributes.lvl / 5 % 1 != 0) {
        user.gameplayAttributes.maxProduce++
      }
    }

    return {'lvlUp': true, 'user': user}
  } else {
    return {'lvlUp': false, 'user': user}
  }
}
