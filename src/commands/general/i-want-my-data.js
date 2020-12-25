/**
 * @author CallMeMrSam
 */
const Client = require('../../../structure/Client');
const Language = require('../../../structure/Language');
const { Command, Embed } = require('../../../structure/Bot');
const { Message } = require('discord.js');

let data = require('../../../data.json');

module.exports = class extends Command {
    
  /**
   * Command
   * @param {Client} client 
   */
  constructor(client) {
    super(client, {
      name: "i-want-my-data",
      aliases: [],
      usage: [],
      guild: '772040813126877195'
    });
  }

  /**
   * Exécuter la commande
   * @param {Language} language
   * @param {Message} message 
   * @param {String[]} args 
   */
  async run(language, message, args) {
    if(!data.map(x => x.id).includes(message.author.id)) return message.channel.send("tu n'as pas de data");
    let udata = data[data.map(x => x.id).indexOf(message.author.id)];
    await this.client.db.updateMember(message.guild, message.member, udata)
    message.channel.send('vous avez récupéré votre data')
  }
}