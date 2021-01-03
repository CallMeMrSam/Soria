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
      name: "badges",
      aliases: [],
      usage: ['badges']
    });
  }

  /**
   * Exécuter la commande
   * @param {Language} language
   * @param {Message} message 
   * @param {String[]} args 
   */
  async run(language, message, args) {
    let badges = this.client.globalBadges.list.map(x => {
      return {
        n: x.badge + ' ' + language.get('general', `badges.${x.name}.name`),
        d: `> ${language.get('general', `badges.${x.name}.description`)}`
      }
    })

    let e = new Embed(this.client, 'main', language)
      .fast(language.get('commands', 'badges.title'), language.get('commands', 'badges.description'))
      .sender(message.author)
    
    badges.forEach((b) => {
      e.addField(b.n, b.d, true)
    })

    e.sendIn(message.channel);
  }
}