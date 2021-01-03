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
   * @param {Client} client 
   */
  constructor(client) {
    super(client, {
      name: "invite",
      aliases: [],
      usage: ['invite']
    });
  }

  /**
   * Exécuter la commande
   * @param {Language} language
   * @param {Message} message 
   * @param {String[]} args 
   */
  async run(language, message, args) {
    message.channel.send(language.get('commands', 'invite.add'))
  }
}