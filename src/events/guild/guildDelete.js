const Client = require('../../../structure/Client');
const { Event, Embed } = require('../../../structure/Bot');
const { Guild } = require('discord.js');

module.exports = class extends Event {

  constructor() {
    super('guildDelete');
  }

  /**
   * 
   * @param {Client} client 
   * @param {Guild} guild
   */
  async run(client, guild) {
    await client.db.deleteGuild(guild);
    if(client.channels.cache.get('791703562576461865')) {
      new Embed(client, 'error', null, true)
        .setTitle(`${client.user.username} left a server`)
        .setDescription(`> **${guild.name}**`)
        .setThumbnail(guild.iconURL())
        .addField('Member Count', `> **${guild.memberCount}**`)
        .sendIn(client.channels.cache.get('791703562576461865'))
    }
  }
}