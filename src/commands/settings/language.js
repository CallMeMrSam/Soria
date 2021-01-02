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
		let new_language = args.shift();
		if(!new_language || !language.getAllLanguage.includes(new_language.toLowerCase())) return Embed.getHelpEmbedFor('language', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('commands', 'language.messages.unvalid_language', { languages: language.getAllLanguage.join(', ') })).sender(message.author).sendIn(message.channel);
		
		await this.client.db.updateGuild(message.guild, { 'language': new_language.toLowerCase() });
		language = this.client.getLanguage(new_language.toLowerCase())
		return Embed.success(this.client, message.author, language, 'commands', 'language.messages.updated', { language: new_language }).sendIn(message.channel)
	}
}