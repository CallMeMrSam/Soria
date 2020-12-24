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
            name: "prefix",
            aliases: [`soria-prefix`],
            usage: ['prefix <new prefix>', 'prefix <default>'],
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
        if(args[0] && args[0].toLowerCase() === 'default') {
		    await this.client.db.updateGuild(message.guild, { 'prefix': this.client.config.DEFAULT_SETTINGS.prefix });
            return Embed.success(this.client, message.author, language, 'commands', 'prefix.messages.prefix_reset', { prefix: this.client.config.DEFAULT_SETTINGS.prefix }).sendIn(message.channel)
        }

        if(!args[0]) return Embed.error(this.client, message.author, language, 'errors', 'no_argument').sendIn(message.channel);
        let prefix = args[0];
        await this.client.db.updateGuild(message.guild, { 'prefix': prefix });
        return Embed.success(this.client, message.author, language, 'commands', 'prefix.messages.prefix_edit', { prefix }).sendIn(message.channel)

    }
}