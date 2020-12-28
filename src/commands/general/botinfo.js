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
            name: "botinfo",
            aliases: ['soriainfo'],
            usage: ['botinfo']
        });
    }

    /**
     * Exécuter la commande
     * @param {Language} language
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(language, message, args) {
        let owners = this.client.config.BOT_ADMINS.map(x => this.client.users.cache.get(x) ? '`' + this.client.users.cache.get(x).tag + '`' : '').join(', ');
        let commands = this.client.commands.size;
        let users = this.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        let guilds = this.client.guilds.cache.size;
        let channels = this.client.channels.cache.size;
        let memoryUsage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
        let clientUptime = this.client.functions.msToDurationFormated(this.client.uptime, language);
        let creationDate = dayjs(this.client.user.createdAt).format(language.get('general', 'time.format')).toString();
        
        new Embed(this.client, 'main', language)
            .fast(language.get('commands', 'botinfo.title'), '')
            .addField(language.get('commands', "botinfo.owners"), `> ${owners}`, true)
            .addField(language.get('commands', "botinfo.commands"), `> \`${commands}\``, true)
            .addField(language.get('commands', "botinfo.version"), `> \`${version}\``, true)
            .addField(language.get('commands', "botinfo.users"), `> \`${users}\``, true)
            .addField(language.get('commands', "botinfo.guilds"), `> \`${guilds}\``, true)
            .addField(language.get('commands', "botinfo.channels"), `> \`${channels}\``, true)
            .addField("\u200B", "\u200B")
            .addField(language.get('commands', "botinfo.dependencies"), `> Node.js \`${process.version}\`\n> Discord.js \`${DjsVersion}\``, true)
            .addField(language.get('commands', "botinfo.memory"), `> \`${memoryUsage}\``, true)
            .addField(language.get('commands', "botinfo.uptime"), `> ${clientUptime}`, true)
            .addField(language.get('commands', "botinfo.creation_date"), `> ${creationDate}`, true)
            .sender(message.author)
            .sendIn(message.channel)
    }
}