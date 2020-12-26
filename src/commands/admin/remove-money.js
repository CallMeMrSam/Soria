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
            name: "remove-money",
            aliases: [],
            usage: ['remove-money <@user> <amount>'],
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
        if(!member) return Embed.getHelpEmbedFor('remove-money', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'invalid_user')).sender(message.author).sendIn(message.channel)
        args.shift();
        let n = args.shift()
        let removedMoney = new Number(n);
        if(!n || !removedMoney || isNaN(removedMoney)) return Embed.getHelpEmbedFor('remove-money', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'invalid_number')).sender(message.author).sendIn(message.channel)
        if(removedMoney >= 10e6) return Embed.error(this.client, message.author, language, 'errors', 'too_big_number').sendIn(message.channel);
        if(removedMoney < 0) return Embed.error(this.client, message.author, language, 'errors', 'no_negative_number').sendIn(message.channel);

        let data = await this.client.db.getMember(message.guild, message.member);
        let money = (+data.money || 0) - removedMoney;
        if(money < 0) money = 0;

        await this.client.db.updateMember(message.guild, member, {
          'money': money
        })
    
        message.channel.send(language.get('commands', 'remove-money.messages.remove', { money: removedMoney, user: member.user.tag }))
    }
}