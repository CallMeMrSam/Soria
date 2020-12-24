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
            name: "profile",
            aliases: [],
            usage: ['profile', 'profile <user>'],
            module: 'social'
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
        if(member.id !== message.author.id) data = await this.client.db.getMember(message.guild, member);
    
        let profile = new Embed(this.client, 'main', language)
          .setAuthor(member.nickname || member.user.username, member.user.avatarURL())
          .setColor(member.displayHexColor)
          .addField(language.get('commands', 'profile.level'), `> **${data.level}**`, true)
          .addField(language.get('commands', 'profile.reputation'), `> **${data.reputation}**`, true)
          .addField(language.get('commands', 'profile.money'), `> **${data.money}$**`, true)
      
        if(data.bio) profile.setDescription(data.bio);
        if(message.author.id !== member.id) profile.sender(message.author)
        profile.sendIn(message.channel)
    }
}