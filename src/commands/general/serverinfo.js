/**
 * @author CallMeMrSam
 */
const Client = require('../../../structure/Client');
const Language = require('../../../structure/Language');
const { Command, Embed } = require('../../../structure/Bot');
const { Message, version: DjsVersion } = require('discord.js');

const { version } = require('../../../package.json');
const dayjs = require('dayjs');

module.exports = class extends Command {
    
    /**
     * Command
     * @param {Client} client 
     */
    constructor(client) {
        super(client, {
            name: "serverinfo",
            aliases: [],
            usage: ['serverinfo']
        });
    }

    /**
     * Exécuter la commande
     * @param {Language} language
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(language, message, args) {
        let guild = this.client.permissions.botAdmin(message.member, this.client) ? this.client.guilds.cache.get(args[0]) || message.guild : message.guild;
        
        let _members = await guild.members.fetch();
        let botCount = _members.filter((x) => x.user.bot).size;
        let memberCount = _members.size - botCount;
        let boostCount = _members.filter((x) => x.premiumSinceTimestamp);
        let channelCount = guild.channels.cache.size;
        let emojiCount = guild.emojis.cache.size;
        let roleCount = guild.roles.cache.size;
        let owner = guild.owner.user.tag;
        let creationDate = dayjs(guild.createdAt).format(language.get('general', 'time.format')).toString();

        new Embed(this.client, 'main', language)
            .setAuthor(guild.name, guild.iconURL())
            .addField(language.get('commands', 'serverinfo.members'), `> \`${memberCount}\``, true)
            .addField(language.get('commands', 'serverinfo.bots'), `> \`${botCount}\``, true)
            .addField(language.get('commands', 'serverinfo.boosts'), `> \`${boostCount}\``, true)
            .addField(language.get('commands', 'serverinfo.channels'), `> \`${channelCount}\``, true)
            .addField(language.get('commands', 'serverinfo.emojis'), `> \`${emojiCount}\``, true)
            .addField(language.get('commands', 'serverinfo.roles'), `> \`${roleCount}\``, true)
            .addField(language.get('commands', 'serverinfo.owner'), `> \`${owner}\``)
            .addField(language.get('commands', 'serverinfo.creation_date'), `> ${creationDate}`)
            .sender(message.author)
            .sendIn(message.channel)
    }
}