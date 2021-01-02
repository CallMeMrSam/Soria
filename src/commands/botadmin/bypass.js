/**
 * @author CallMeMrSam
 */
const Client = require('../../../structure/Client');
const Language = require('../../../structure/Language');
const { Command, Embed } = require('../../../structure/Bot');
const { Message, MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    
  /**
   * Command
   * @param {Client} client Client
   */
  constructor(client) {
    super(client, {
      name: "bypass",
      aliases: [],
      usage: ['bypass'],
      permission: "botAdmin",
      moduleInfoHidden: true
    });
  }

  /**
   * Exécuter la commande
   * @param {Language} language
   * @param {Message} message 
   * @param {String[]} args 
   */
  async run(language, message, args) {
    if(this.client.bypassUsers.has(message.author.id)) {
      this.client.bypassUsers.delete(message.author.id);
      message.channel.send(`bypass disabled`);
    } else {
      this.client.bypassUsers.add(message.author.id);
      message.channel.send(`bypass enabled`);
    }
  }
}