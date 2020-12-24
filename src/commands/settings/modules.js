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
            name: "module",
            aliases: ['modules'],
            usage: ['module list', 'module info <module>', 'module toggle <module>'],
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
        let subCmd = args[0] ? args.shift().toLowerCase() : '';      
        switch(subCmd) {
            case 'list':
                let activated = message.data.guild.modules.map((x) => `• ${x}`).join('\n');
                let disabled = this.client.getModules.filter((x) => !message.data.guild.modules.includes(x)).map((x) => `• ${x}`).join('\n');
                new Embed(this.client, 'main', language)
                    .fast(language.get('commands', 'module.title'), 
                        `${language.get('commands', 'module.messages.activated_modules')}\n${activated}\n\n${language.get('commands', 'module.messages.disabled_modules')}\n${disabled}`)
                    .addField(language.get('commands', 'module.messages.toggle_module'), `> \`${message.prefix}module toggle <module>\``)
                    .sender(message.author)
                    .sendIn(message.channel)
                break;
            case 'info':
                if(!args[0] || !this.client.modulesInfo[args[0].toLowerCase()]) return Embed.error(this.client, message.author, language, 'commands', 'module.messages.invalid_module').sendIn(message.channel);
                let infos = this.client.modulesInfo[args[0].toLowerCase()];
                new Embed(this.client, 'main', language)
                    .fast(language.get('commands', 'module.title') + ` | ${args[0].toLowerCase()}`,
                        `${language.get('commands', 'module.messages.undesactivable', { b: infos.undesactivable })}\n\n${language.get('commands', 'module.messages.commands', { c: infos.commands.map(x => `\`${x}\``).join('\n')})}`)
                    .sender(message.author)
                    .sendIn(message.channel)
                break;
            case 'toggle':
                if(!args[0] || !this.client.getModules.includes(args[0].toLowerCase())) return Embed.error(this.client, message.author, language, 'commands', 'module.messages.invalid_module').sendIn(message.channel);
                let toggled_module = args[0].toLowerCase();
                if(this.client.modulesInfo[toggled_module] && this.client.modulesInfo[toggled_module].undesactivable) return Embed.error(this.client, message.author, language, 'commands', 'module.messages.undesactivable_module').sendIn(message.channel);
                let guildModules = message.data.guild.modules;

                let isActivated = true;
                if(guildModules.includes(toggled_module)) {
                    isActivated = false;
                    guildModules.splice(guildModules.indexOf(toggled_module), 1);
                } else {
                    guildModules.push(toggled_module);
                }

                await this.client.db.updateGuild(message.guild, {
                    'modules': guildModules
                });
                Embed.success(this.client, message.author, language, 'commands', isActivated ? 'module.messages.module_activated': 'module.messages.module_disabled', {m: toggled_module})
                    .sendIn(message.channel)
                break;
            default: 
                Embed.getHelpEmbedFor('module', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'no_argument')).sender(message.author).sendIn(message.channel)
                break;
        }
    }
}