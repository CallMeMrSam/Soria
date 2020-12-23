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
            name: "rank",
            aliases: ['level'],
            usage: ['rank', 'rank <user>'],
            module: 'levels'
        });
    }

    /**
     * Exécuter la commande
     * @param {Language} language
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(language, message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(x => x.user.tag === args.join(' ')).first() || message.member;
    
        let data = message.data.member;
        if(member.id !== message.author.id) data = await this.client.db.getMember(member.id);
    
        new Embed(this.client, 'main', language)
          .setAuthor(member.nickname || member.user.username, member.user.avatarURL())
          .setColor(member.displayHexColor)
          .setDescription(`${language.get('commands', 'rank.level', { level: data.level })} (${data.experience}/${this.client.functions.xpMax(data.level)})\n${this.client.functions.xpProgressBar(this.client, data.level, data.experience)}`)
          .sender(message.author)
          .sendIn(message.channel)
    }
}