const { User } = require("discord.js");
const Client = require('../structure/Client');

module.exports = {
  /**
   * 
   * @param {User} user 
   * @param {Client} client 
   * @param {*} userData 
   */
  getUserBadges: (user, client, userData) => {
    let badges = [];
    module.exports.list.forEach((b) => b.condition(user, client, userData) ? badges.push(b.badge) : '')
    return badges;
  },
  list: [
    {
      name: 'botAdmin',
      badge: '🔧',
      
      /**
       * 
       * @param {User} user 
       * @param {Client} client 
       * @param {*} userData 
       */
      condition: (user, client, userData) => client.permissions.botAdmin(user, client)
    },
    {
      name: 'addBot',
      badge: '🚀',
      
      /**
       * 
       * @param {User} user 
       * @param {Client} client 
       * @param {*} userData 
       */
      condition: (user, client, userData) => client.guilds.cache.filter(g => g.ownerID === user.id).size > 0
    }
  ]
}