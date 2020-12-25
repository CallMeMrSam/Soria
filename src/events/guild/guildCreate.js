const Client = require('../../../structure/Client');
const { Event, Embed } = require('../../../structure/Bot');
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
  async run(client, guild) {
    await client.db.createGuild(guild);
    if(client.channels.cache.get('791703562576461865')) {
      new Embed(client, 'success', null, true)
        .setTitle(`${client.user.name} joined a server`)
        .setDescription(`> **${guild.name}**`)
        .setThumbnail(guild.iconURL())
        .addField('Member Count', `> **${guild.memberCount}**`, true)
        .sendIn(client.channels.cache.get('791703562576461865'))
    }
  }
}