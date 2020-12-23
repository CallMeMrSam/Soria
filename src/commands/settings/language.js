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
            name: "language",
            aliases: [],
            usage: ['language <language>'],
            permission: 'owner'
        });
    }

    /**
     * Exécuter la commande
     * @param {Language} language
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(language, message, args) {
        let new_language = args.shift();
        if(!new_language) return Embed.getHelpEmbedFor('language', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'no_argument')).sender(message.author).sendIn(message.channel)
    }
}