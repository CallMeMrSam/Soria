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
            name: "poll",
            aliases: ["poll"],
            usage: ['poll "title" "question"']
        });
    }

    /**
     * Exécuter la commande
     * @param {Language} language
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(language, message, args) {
      if(!args[0]) return Embed.getHelpEmbedFor('poll', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'no_argument')).sender(message.author).sendIn(message.channel);
      let options = this.client.functions.extractAllText(args.join(' '));
      let title = options.shift();

      if(options.length !== 1) return Embed.getHelpEmbedFor('poll', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('commands', 'poll.error')).sender(message.author).sendIn(message.channel);
      
      new Embed(this.client, 'main', language)
        .setColor(message.member.displayColor)
        .setAuthor(language.get('commands', 'poll.title', { user: message.author.tag }), message.author.displayAvatarURL())
        .setDescription(`${title}\n▶ ${options[0]}`)
        .sendIn(message.channel)
        .then(async(m) => {
          await m.react('⏫')
          await m.react('⏬')
        })
    }
}