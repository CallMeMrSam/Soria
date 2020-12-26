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
            name: "xp-multiplier",
            aliases: [],
            usage: ['xp-multiplier global <amount>', 'xp-multiplier global default'],
            module: 'levels',
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
        let subCmd = args[0] ? args.shift().toLowerCase() : '';      
        switch(subCmd) {
            case 'global':
                let globalMultiplier = args.shift();
                if(globalMultiplier && globalMultiplier.toLowerCase() === 'default') {
                    await this.client.db.updateGuild(message.guild, { settings: { globalXpMultiplier: 1 }});
                    return Embed.success(this.client, message.author, language, 'commands', 'xp-multiplier.messages.global_reset').sendIn(message.channel);
                }
                if(!globalMultiplier || isNaN(globalMultiplier)) return Embed.error(this.client, message.author, language, 'errors', 'invalid_number').sendIn(message.channel);
                if(globalMultiplier > 5) return Embed.error(this.client, message.author, language, 'errors', 'number_between', { a: '0', b: '5' }).sendIn(message.channel);
                if(globalMultiplier <= 0) return Embed.error(this.client, message.author, language, 'errors', 'no_negative_number').sendIn(message.channel);

                await this.client.db.updateGuild(message.guild, { settings: { globalXpMultiplier: globalMultiplier }});

                Embed.success(this.client, message.author, language, 'commands', 'xp-multiplier.messages.global_set', { ammount: globalMultiplier, warning: globalMultiplier < 1 ? language.get('commands', 'xp-multiplier.messages.warning') : '' }).sendIn(message.channel);
                break;
            default:
                Embed.getHelpEmbedFor('xp-multiplier', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'no_argument')).sender(message.author).sendIn(message.channel)
                break;
        }
    }
}