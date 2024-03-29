const Client = require('../structure/Client');
const Language = require('../structure/Language');
const { GuildMember, Role } = require('discord.js');

/**
 * 
 * @param {number} ms 
 *
module.exports.msToDuration = (ms) => {
  return {
      seconds: (''+ Math.floor((ms/1000) % 60)).padStart(1, '0'),
      minutes: (''+ Math.floor((ms/(1000 *60)) % 60)).padStart(2, '0'),
      hours: (''+ Math.floor((ms/(1000*60*60)) % 60)).padStart(2, '0'),
      days: (''+ Math.floor((ms/(1000*60*60*24)) % 60)).padStart(2, '0')
  }
}*/

/**
 * 
 * @param {number} ms 
 */
module.exports.msToDuration = (ms) => {
  let days = Math.floor(ms / (24*60*60*1000));
  let daysms=ms % (24*60*60*1000);
  let hours = Math.floor((daysms)/(60*60*1000));
  let hoursms=ms % (60*60*1000);
  let minutes = Math.floor((hoursms)/(60*1000));
  let minutesms=ms % (60*1000);
  let seconds = Math.floor((minutesms)/(1000));
  return { seconds, minutes, hours, days }
}

/**
 * 
 * @param {number} ms 
 * @param {Language} language 
 */
module.exports.msToDurationFormated = (ms, language, showSeconds = false) => {
  let t = this.msToDuration(ms);
  let days = (+t.days);
  let hours = (+t.hours);
  let minutes = (+t.minutes);
  let seconds = (+t.seconds);
  
  let r = [];
  if(days > 0) r.push(`${days} ` + (days > 1 ? language.get('general', 'time.days') : language.get('general', 'time.day')));
  if(hours > 0) r.push(`${hours} ` + (hours > 1 ? language.get('general', 'time.hours') : language.get('general', 'time.hour')));
  if(minutes > 0) r.push(`${minutes} ` + (minutes > 1 ? language.get('general', 'time.minutes') : language.get('general', 'time.minute')));
  if(showSeconds && seconds > 0) r.push(`${seconds} ` + (seconds > 1 ? language.get('general', 'time.seconds') : language.get('general', 'time.second')));
  if(!showSeconds && r.length === 0) r.push(language.get('general', 'time.a_minute_ago')); 
  return r.join(' ');
}

/**
* Calucler le nombre d'xp nécessaire
* @param {number} level Niveau actuel
*/
module.exports.xpMax = (level) => 5 * (level ^ 2) + 50 * level + 100;  //3000 * Math.round( (level) * (level + 1) / 2 )

/**
 * Créer une barre de progression
 * @param {number} level Niveau actuel de la barre
 * @param {number} maxLevel Niveau maximum de la barre
 * @param {number} size Taille de la barre
 * @param {string} reached Caractère pour la partie remplie de la barre
 * @param {string} notReached Caractère pour la partie non remplie de la barre
 */
module.exports.progressBar = (level, maxLevel, size, reached='O', notReached='X', separator="") => reached.repeat( (level/maxLevel)*(size) ) + separator + notReached.repeat( size-((level/maxLevel)*(size))+1 )

/**
 * 
 * @param {Client} client 
 * @param {number} xp 
 * @param {number} xpmax 
 * @param {number} size 
 */
module.exports.xpProgressBar = (client, level, xp, size = 8) => client.constants.EMOJIS.progressStart + this.progressBar(
    xp,
    this.xpMax(level),
    size,
    client.constants.EMOJIS.progressReached,
    client.constants.EMOJIS.progressNotReached,
    client.constants.EMOJIS.progressSeparator,
    '•'
) + client.constants.EMOJIS.progressEnd

/**
 * 
 * @param {Role} role 
 */
module.exports.canGiveRole = (role) => (role.position < role.guild.me.roles.highest.position) && role.guild.me.permissions.has('MANAGE_ROLES', true)

/**
 * Obtenir un nombre aléatoire depuis une intervale.
 * @param {number} min
 * @param {number} max
 */
module.exports.randomIntFromInterval = (min, max) => Math.floor(Math.random() * ( max-min+1 ) + min);

/**
 * 
 * @param {string} str 
 */
module.exports.extractAllText = (str) => {
  const re = /"(.*?)"/g;
  const result = [];
  let current;
  while (current = re.exec(str)) {
    result.push(current.pop());
  }
  return result.length > 0
    ? result
    : [str];
}

/**
 * 
 * @param {Number} xp 
 * @param {Number} winXp 
 * @param {Number} level
 * @param {GuildMember} member
 * @param {object} data
 * @param {Client} client 
 */
module.exports.levelUp = (xp, level, member, data, client) => {
  let xpMax = this.xpMax(level);
  let winLevel = 0;
  let winRole = [];

  while (xp >= xpMax) {;
    xp -= xpMax
    level++;
    winLevel++;
    xpMax = this.xpMax(level);
    
    if(data.guild && data.guild.settings && data.guild.settings.roleReward) {
      role = member.guild.roles.cache.get(data.guild.settings.roleReward[level]);
      if(role && client.functions.canGiveRole(role)) { member.roles.add(role); winRole.push(role); }
    }
  }

  return { winLevel, winRole, xp, level }
}