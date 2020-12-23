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
            name: "role-reward",
            aliases: [],
            usage: ['role-reward list', 'role-reward set <level> <role>', 'role-reward delete <level>'],
            module: 'levels',
            permission: 'owner'
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
            case 'set':
                let roleLevel = args.shift();
                if(!roleLevel || isNaN(roleLevel)) return Embed.error(this.client, message.author, language, 'errors', 'no_argument').sendIn(message.channel);

                let addRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || undefined;
                if(!addRole) return Embed.error(this.client, message.author, language, 'errors', 'no_role').sendIn(message.channel);

                let SpushData = { roleReward: {} };
                SpushData.roleReward[roleLevel] = addRole.id;

                await this.client.db.updateGuild(message.guild, { settings: SpushData })

                Embed.success(this.client, message.author, language, 'commands', 'role-reward.messages.role_set', { level: roleLevel, role: addRole.name }).sendIn(message.channel);
                break;
            case 'delete':
                let removeLevel = args.shift();
                if(!removeLevel || isNaN(removeLevel)) return Embed.error(this.client, message.author, language, 'errors', 'no_argument').sendIn(message.channel);
                
                let DpushData = { roleReward: {} };
                DpushData.roleReward[removeLevel] = null;
                
                await this.client.db.updateGuild(message.guild, { settings: DpushData })
                
                Embed.success(this.client, message.author, language, 'commands', 'role-reward.messages.role_delete', { level: removeLevel }).sendIn(message.channel);
                break;
            case 'list':
                let roles = message.data.guild.settings.roleReward;
                let list = [];
                for(const l in roles) {
                    if(message.guild.roles.cache.get(roles[l])) list.push({level: l, role: message.guild.roles.cache.get(roles[l])});
                }
                list = list.sort((a, b) => a.level - b.level);

                new Embed(this.client, 'main', language)
                    .fast(language.get('commands', 'role-reward.title'), list.length > 0 ? list.map(x => `• ${x.level} - ${x.role}`).join('\n') : language.get('commands', 'role-reward.messages.no_roles'))
                    .sender(message.author)
                    .sendIn(message.channel)
                break;
            default:
                Embed.getHelpEmbedFor('role-reward', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'no_argument')).sender(message.author).sendIn(message.channel)
                break;
        }
    }
}