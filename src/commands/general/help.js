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
     * @param {Client} client 
     */
    constructor(client) {
        super(client, {
            name: "help",
            aliases: ['h'],
            usage: ['help <command>']
        });
    }

    /**
     * Exécuter la commande
     * @param {Language} language
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(language, message, args) {
        
        let commands = Object.assign({}, this.client.getCommands);
        let categories = [];

        for(var c in commands) {
            commands[c] = commands[c]
                .filter((x) => message.data.guild.modules.includes(x.module))
                .filter((x) => this.client.permissions[x.permission](message.member, this.client));
            if(commands[c].length > 0) categories.push(this.client.constants.HELP[c] ? Object.assign({id: c}, this.client.constants.HELP[c]) : {id: c, name: c, emoji: '📄', pos: 99})
        }
        categories = categories.sort((a, b) => a.pos-b.pos);

        if(args[0]) {
            let command;
            
            if(this.client.commands.get(args[0].toLowerCase())) {
                command = this.client.commands.get(args[0].toLowerCase());
            }
            else if(this.client.aliases.get(args[0].toLowerCase())) {
                command = this.client.commands.get(this.client.aliases.get(args[0].toLowerCase()));
            }
            else return Embed.error(this.client, message.author, language, 'commands', 'help.messages.cannot_find_command').sendIn(message.channel);
            if(!this.client.permissions[command.config.permission](message.member, this.client)) return Embed.error(this.client, message.author, language, 'errors', 'no_permission', {p: command.config.permission}).sendIn(message.channel);
            
            let category = categories.find(i => i.id === command.info.category);

            return Embed.getHelpEmbedFor(command.info.name, message.prefix, language, this.client)
                .fast(`${command.info.name} ─ ${category.emoji} ${language.get('categories', category.id)}`,
                    language.get('commands', 'help.messages.info_command', { command: command.info.name }))
                .sender(message.author)
                .sendIn(message.channel);

        } else {
            if(!message.guild.me.permissions.has('MANAGE_MESSAGES') || !message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) return Embed.error(this.client, message.author, language, 'errors', 'missing_permission' + message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES') ? '_channel' : '', { p: "MANAGE_MESSAGES" }).sendIn(message.channel);

            let currentPage = 0;
            let renderPage = () => {
                let currentCategory = categories[currentPage];
                let currentCmds = commands[currentCategory.id];
    
                return new Embed(this.client, 'main', language)
                    .fast(`${currentCategory.emoji} ${language.get('categories', currentCategory.id)} ─ (${currentPage+1}/${categories.length})`, currentCmds.map(x => `> \`${message.prefix}${x.name}\` ${language.get('commands', `${x.name}.description`)}`).join('\n'))
                    .addField('\u200b', language.get('commands', 'help.messages.more_help', { prefix: message.prefix }))
                    .addField('\u200b', language.get('commands', 'help.messages.infos'))
                    .sender(message.author)
            }
    
            let filter = (reaction, user) => {
                return (reaction.emoji.name === '⏮️'
                    || reaction.emoji.name === '◀️'
                    || reaction.emoji.name === '▶️'
                    || reaction.emoji.name === '⏭️'
                    || reaction.emoji.name === '❌')
                    && user.id === message.author.id
            }
            
            let msg = await renderPage(this.client, currentPage).sendIn(message.channel)
            
            Promise.all([
                msg.react('⏮️'),
                msg.react('◀️'),
                msg.react('▶️'),
                msg.react('⏭️'),
                msg.react('❌')
            ]);

            let collector = msg.createReactionCollector(filter, { time: 60000 });
            
            collector.on('collect', async(reaction, user) => {
    
                await reaction.users.remove(user);
                switch(reaction.emoji.name) {
                    case '⏮️':
                        currentPage = 0;
                        msg.edit(renderPage())
                        break;
                    case '◀️':
                        currentPage--;
                        if(currentPage < 0) currentPage = (categories.length-1);
                        msg.edit(renderPage())
                        break;
                    case '▶️':
                        currentPage++;
                        if(currentPage >= categories.length) currentPage = 0;
                        msg.edit(renderPage())
                        break;
                    case '⏭️':
                        currentPage = (categories.length-1);
                        msg.edit(renderPage())
                        break;
                    case '❌':
                        collector.stop();
                    default: break;
                }
            })
    
            collector.on('end', (collected) => {
                msg.reactions.removeAll();
            })
        }
    }
}