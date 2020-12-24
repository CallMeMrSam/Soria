const { GuildMember } = require('discord.js');
const Client = require('../structure/Client');

module.exports = {

  /**
   * 
   * @param {GuildMember} member 
   * @param {Client} client 
   */
  user: (member, client) => true,
  
  /**
   * 
   * @param {GuildMember} member 
   * @param {Client} client 
   */
  admin: (member, client) => member.guild.ownerID === member.id || (member.permissions.toArray().some((p) => ['ADMINISTRATOR', 'MANAGE_GUILD'].includes(p))),
  
  /**
   * 
   * @param {GuildMember} member 
   * @param {Client} client 
   */
  owner: (member, client) => member.guild.ownerID === member.id, 

  /**
   * 
   * @param {GuildMember} member 
   * @param {Client} client 
   */
  botAdmin: (member, client) => client.config.BOT_ADMINS.includes(member.id)
}