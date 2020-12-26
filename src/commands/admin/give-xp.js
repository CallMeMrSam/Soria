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
            name: "give-xp",
            aliases: [],
            usage: ['give-xp <@user> <amount>'],
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
        let member = message.mentions.members.first();
        if(!member) return Embed.getHelpEmbedFor('give-xp', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'invalid_user')).sender(message.author).sendIn(message.channel)
        args.shift();
        let n = args.shift()
        let givenXP = new Number(n);
        if(!n || !givenXP || isNaN(givenXP)) return Embed.getHelpEmbedFor('give-xp', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'invalid_number')).sender(message.author).sendIn(message.channel)
        if(givenXP >= 10e6) return Embed.error(this.client, message.author, language, 'errors', 'too_big_number').sendIn(message.channel)
        if(givenXP < 0) return Embed.error(this.client, message.author, language, 'errors', 'no_negative_number').sendIn(message.channel);
    
        let data = await this.client.db.getMember(message.guild, message.member);
        let { winLevel, winRole, xp, level } = this.client.functions.levelUp((+data.experience || 0) + givenXP, (+data.level || 1), member, message.data, this.client);
        
        await this.client.db.updateMember(message.guild, member, {
          'experience': xp,
          'level': level
        })
    
        message.channel.send(`${language.get('commands', 'give-xp.messages.give', { xp: givenXP, user: member.user.tag })}${winLevel > 0 ? ` (+${winLevel} ${language.get('commands', 'give-xp.levels')})` : ''}`)
    }
}