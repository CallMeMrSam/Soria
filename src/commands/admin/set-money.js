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
            name: "set-money",
            aliases: [],
            usage: ['set-money <@user> <amount>'],
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
        if(!member) return Embed.getHelpEmbedFor('set-money', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'invalid_user')).sender(message.author).sendIn(message.channel)
        args.shift();
        let n = args.shift()
        let money = new Number(n);
        if(!n || !money || isNaN(money)) return Embed.getHelpEmbedFor('set-money', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'invalid_number')).sender(message.author).sendIn(message.channel)
        if(money >= 10e6) return Embed.error(this.client, message.author, language, 'errors', 'too_big_number').sendIn(message.channel);
        if(money < 0) return Embed.error(this.client, message.author, language, 'errors', 'no_negative_number').sendIn(message.channel);
        
        await this.client.db.updateMember(message.guild, member, {
          'money': money
        })
    
        message.channel.send(language.get('commands', 'set-money.messages.set', { money: money, user: member.user.tag }))
    }
}