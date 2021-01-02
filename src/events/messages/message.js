const Client = require('../../../structure/Client');
const { Event, Embed } = require('../../../structure/Bot');
const { Message } = require('discord.js');

module.exports = class extends Event {

  constructor() {
    super('message');
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   */
  async run(client, message) {
    if(message.author.bot) return;
    if(!message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;

    message.data = {
        guild: await client.db.getGuild(message.guild),
        member: await client.db.getMember(message.guild, message.member),
        user: await client.db.getUser(message.author.id)
    }

    if(!message.data.guild.modules.includes('default')) message.data.guild.modules.push('default')

    message.prefix = message.data.guild.prefix || client.config.DEFAULT_SETTINGS.prefix
    let language = client.getLanguage(message.data.guild.language || client.config.DEFAULT_SETTINGS.language);
    message.language = language

    if(message.content.indexOf(message.prefix) !== 0) {
      if(message.data.guild.modules.includes('levels')) client.emit('xp', (language, message))
      return
    }

    const args = message.content.slice(message.prefix.length).trim().split(/\s+/g);
    message.cleanArgs = message.cleanContent.slice(message.prefix.length).trim().split(/\s+/g);
    message.cleanArgs.shift();
    const cmdName = args.shift().toLowerCase();

    if(message.guild && !message.member) await message.guild.fetchMember(message.author);
    
    const cmd = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName));
    if(!cmd) return;

    if(cmd.config.guild && message.guild.id !== cmd.config.guild) return;

    if(!message.data.guild.modules.includes(cmd.config.module)) return Embed.error(client, message.author, language, 'errors', 'module_disabled', {m: cmd.config.module}).sendIn(message.channel);

    if(!client.permissions[cmd.config.permission](message.member, client)) return Embed.error(client, message.author, language, 'errors', 'no_permission', {p: cmd.config.permission}).sendIn(message.channel);

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
    }
    
    cmd.run(language, message, args);
  }
}