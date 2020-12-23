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
            name: "bio",
            aliases: ['biography'],
            usage: ['bio <bio>', 'bio off'],
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
      if(!args[0]) return Embed.getHelpEmbedFor('bio', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'no_argument')).sender(message.author).sendIn(message.channel)
      if(args[0].toLowerCase() === 'off') {
        await this.client.db.updateMember(message.guild, message.member, {
          bio: ''
        })
        return Embed.success(this.client, message.author, language, 'commands', 'bio.messages.bio_off').sendIn(message.channel)
      }
      let bio = message.content.slice(message.content.length - args.join(' ').length);
      if(bio.length <= 3 || bio.length >= 2048) return Embed.error(this.client, message.author, language, 'commands', 'bio.messages.error_length').sendIn(message.channel)
      
      await this.client.db.updateMember(message.guild, message.member, {
        'bio': bio
      })
      return Embed.success(this.client, message.author, language, 'commands', 'bio.messages.bio_updated').sendIn(message.channel)
    }
}