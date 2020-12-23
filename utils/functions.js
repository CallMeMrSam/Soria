const Client = require('../structure/Client');
const { Guild, Role } = require('discord.js');

/**
 * 
 * @param {number} ms 
 */
module.exports.msToDuration = (ms) => {
  return {
      seconds: (''+ Math.floor((ms/1000) % 60)).padStart(1, '0'),
      minutes: (''+ Math.floor((ms/(1000 *60)) % 60)).padStart(2, '0'),
      hours: (''+ Math.floor((ms/(1000*60*60)) % 60)).padStart(2, '0'),
      days: (''+ Math.floor((ms/(1000*60*60*24)) % 60)).padStart(2, '0')
  }
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