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
            name: "give-money",
            aliases: [],
            usage: ['give-money <@user> <amount>'],
            module: 'economy',
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
        let member = message.mentions.members.first();
        if(!member) return Embed.getHelpEmbedFor('give-money', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'invalid_user')).sender(message.author).sendIn(message.channel)
        args.shift();
        let n = args.shift()
        let givenMoney = new Number(n);
        if(!n || !givenMoney || isNaN(givenMoney)) return Embed.getHelpEmbedFor('give-money', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'invalid_number')).sender(message.author).sendIn(message.channel)
    
        let data = await this.client.db.getMember(message.guild, message.member);
        let money = (+data.money || 0) + givenMoney;

        await this.client.db.updateMember(message.guild, member, {
          'money': money
        })
    
        message.channel.send(language.get('commands', 'give-money.messages.give', { money: givenMoney, user: member.user.tag }))
    }
}