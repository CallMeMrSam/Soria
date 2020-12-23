/**
 * @author CallMeMrSam
 */
const { Command, Client, Embed, Language } = require('../../../structure/Bot');
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
        
        let commands = this.client.getCommands;
        let categories = this.client.getCategories;
        
        if(args[0]) {
            let command;
            
            if(this.client.commands.get(args[0].toLowerCase())) {
                command = this.client.commands.get(args[0].toLowerCase()).info;
            }
            else if(this.client.aliases.get(args[0].toLowerCase())) {
                command = this.client.commands.get(this.client.aliases.get(args[0].toLowerCase())).info;
            }
            else return this.client.functions.error(this.client, message.channel, language, language.get('commands', 'help.messages.cannot_find_command'), message.author);

            let category = categories.find(i => i.id === command.category);

            let help = new Embed(this.client, "main", language)
                .fast(`${command.name} ─ ${category.emoji} ${language.get('categories', category.id)}`,
                        language.get('commands', 'help.messages.info_command', { command: command.name }))
                .sender(message.author)
                .addField(language.get('help', 'name'), `> \`${command.name}\``, true)
                .addField(language.get('help', 'aliases'), `> ${command.aliases.length > 0 ? command.aliases.map(x => `\`${x}\``).join(', '): language.get('help', 'none')}`, true)
                .addField(language.get('help', 'category'), `> \`${category.name}\``, true)
                .addField(language.get('help', 'description'), `> ${language.get('commands', `${command.name}.description`) || language.get('help', 'no_description')}`)

            if(command.usage.length > 0) {
                help.addField(language.get('help', 'usage'), command.usage.map(x => `> \`${message.prefix}${x}\``).join('\n'))
            }

            if(command.flags.length > 0) {
                help.addField(language.get('help', 'flags'), command.flags.map((x) => `> \`-${x[0]}\`: **${x[1]}**`))
            }

            return help.sendIn(message.channel);

        } else {

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