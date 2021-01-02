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
      name: "rep-time",
      aliases: [],
      usage: ['rep-time <hours>', 'rep-time default'],
      module: 'social',
      permission: 'admin'
    });
  }

  /**
   * Exécuter la commande
   * @param {Language} language
   * @param {Message} message 
   * @param {String[]} args 
   */
  async run(language, message, args) {
    if(!args[0]) return Embed.error(this.client, message.author, language, 'errors', 'no_argument').sendIn(message.channel); 
    if(args[0].toLowerCase() === 'default') {
      await this.client.db.updateGuild(message.guild, { settings: { repTime: 12 }});
      return Embed.success(this.client, message.author, language, 'commands', 'rep-time.messages.time_reset').sendIn(message.channel);
    }

    let time = args.shift();
    if(!time || isNaN(time)) return Embed.error(this.client, message.author, language, 'errors', 'invalid_number').sendIn(message.channel); 
    time = Math.floor(+time);
    if(time < 1 || time > 48) return Embed.error(this.client, message.author, language, 'errors', 'invalid_number_interval', { a: 1, b: 48 }).sendIn(message.channel);

    await this.client.db.updateGuild(message.guild, { settings: { repTime: time }});
    return Embed.success(this.client, message.author, language, 'commands', 'rep-time.messages.time_update', { time }).sendIn(message.channel)
  }
}