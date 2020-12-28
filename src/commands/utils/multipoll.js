/**
 * @author CallMeMrSam
 */
const Client = require('../../../structure/Client');
const Language = require('../../../structure/Language');
const { Command, Embed } = require('../../../structure/Bot');
const { Message } = require('discord.js');

var numbers = {
  1: '1️⃣',
  2: '2️⃣',
  3: '3️⃣',
  4: '4️⃣',
  5: '5️⃣',
  6: '6️⃣',
  7: '7️⃣',
  8: '8️⃣',
  9: '9️⃣',
  10: '🔟'
}

module.exports = class extends Command {
    
    /**
     * Command
     * @param {Client} client Client
     */
    constructor(client) {
        super(client, {
            name: "multipoll",
            aliases: ["mpoll"],
            usage: ['mpoll "title" "option 1" "option 2" "... (max 10)"']
        });
    }

    /**
     * Exécuter la commande
     * @param {Language} language
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(language, message, args) {
      if(!args[0]) return Embed.getHelpEmbedFor('multipoll', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'no_argument')).sender(message.author).sendIn(message.channel);
      let options = this.client.functions.extractAllText(args.join(' '));
      let title = options.shift();

      if(options.length < 2 || options.length > 9) return Embed.getHelpEmbedFor('multipoll', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('commands', 'multipoll.error')).sender(message.author).sendIn(message.channel);
      
      new Embed(this.client, 'main', language)
        .setColor(message.member.displayColor)
        .setAuthor(language.get('commands', 'multipoll.title', { user: message.author.tag }), message.author.displayAvatarURL())
        .setDescription(`${title}\n\n` + options.map((x, i) => `${numbers[i+1]} • ${x}`).join('\n'))
        .sendIn(message.channel)
        .then((m) => {
          options.forEach(async(x, i) => {
            await m.react(numbers[i+1]);
          })
        })
    }
}