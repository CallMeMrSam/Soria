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
    let repTime = 12;

    if(message.data.guild && message.data.guild.settings && message.data.guild.settings.repTime) {
      repTime = (+message.data.guild.settings.repTime);
    }
    repTime *= 3600000;

    let lastRep = (+message.data.member.lastRep || 0);

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(x => x.user.tag === args.join(' ')).first() || undefined;
    if(!member || member.id === message.author.id || member.user.bot) {
      let err = Embed.error(this.client, message.author, language, 'errors', 'invalid_user')
      if((new Date().getTime() - lastRep) <= repTime) err.description += `\n${language.get('commands', 'rep.messages.time', { time: this.client.functions.msToDurationFormated(((lastRep + repTime) - new Date().getTime()), language) })}`
      return err.sendIn(message.channel);
    }
  
    if(lastRep == 0 || (new Date().getTime() - lastRep) >= repTime) {
      let data = await this.client.db.getMember(message.guild, member);
      let rep = (+data.reputation || 0) + 1;

      message.channel.send(language.get('commands', 'rep.messages.give', { author: `<@${message.author.id}>`, user: `<@${member.id}>` }));

      await this.client.db.updateMember(message.guild, member, {
        'reputation': rep
      })
      await this.client.db.updateMember(message.guild, message.member, {
        'lastRep': new Date().getTime()
      })
    } else {
      return Embed.error(this.client, message.author, language, 'commands', 'rep.messages.time', { time: this.client.functions.msToDurationFormated(((lastRep + repTime) - new Date().getTime()), language) }).sendIn(message.channel);
    }
  }
}