/**
 * @author CallMeMrSam
 */
const Client = require('../../../structure/Client');
const Language = require('../../../structure/Language');
const { Command, Embed } = require('../../../structure/Bot');
const { Message } = require('discord.js');

module.exports = class extends Command {
    
  /**
   * Command
   * @param {Client} client Client
   */
  constructor(client) {
    super(client, {
      name: "rep",
      aliases: ['reputation'],
      usage: ['rep <user>'],
      module: 'social'
    });
  }

  /**
   * Exécuter la commande
   * @param {Language} language
   * @param {Message} message 
   * @param {String[]} args 
   */
  async run(language, message, args) {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(x => x.user.tag === args.join(' ')).first() || undefined;
    if(!member || member.id === message.author.id || member.user.bot) return Embed.error(this.client, message.author, language, 'errors', 'invalid_user').sendIn(message.channel);

    let lastRep = (+message.data.member.lastRep || 0);
  
    if(lastRep == 0 || (new Date().getTime() - lastRep) >= 43200000) {
      let data = await this.client.db.getMember(message.guild, message.member);
      let rep = (+data.reputation || 0) + 1;

      message.channel.send(language.get('commands', 'rep.messages.give', { author: `<@${message.author.id}>`, user: `<@${member.id}>` }));

      await this.client.db.updateMember(message.guild, member, {
        'reputation': rep
      })
      await this.client.db.updateMember(message.guild, message.member, {
        'lastRep': new Date().getTime()
      })
    } else {
      return Embed.error(this.client, message.author, language, 'commands', 'rep.messages.time', { time: this.client.functions.msToDurationFormated(((lastRep + 43200000) - new Date().getTime()), language) }).sendIn(message.channel);
    }
  }
}