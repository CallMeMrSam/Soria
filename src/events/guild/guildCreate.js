const Client = require('../../../structure/Client');
const { Event } = require('../../../structure/Bot');
const { Guild } = require('discord.js');

module.exports = class extends Event {

  constructor() {
    super('guildCreate');
  }

  /**
   * 
   * @param {Client} client 
   * @param {Guild} guild
   */
  run(client, guild) {
    console.log('new guild: ', guild.name)
  }
}