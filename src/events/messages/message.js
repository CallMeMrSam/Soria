const Client = require('../../../structure/Client');
const { Event, Embed } = require('../../../structure/Bot');
const { Message } = require('discord.js');

module.exports = class extends Event {
  /**
   * 
   * @param {Client} client 
   */
  constructor(client) {
    super('message');
    this.client = client;
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

    message.prefix = message.data.guild.prefix || client.config.DEFAULT_SETTINGS.prefix

    if(message.content.indexOf(message.prefix) !== 0) return;

    const args = message.content.slice(message.prefix.length).trim().split(/\s+/g);
    const cmdName = args.shift().toLowerCase();

    if(message.guild && !message.member) await message.guild.fetchMember(message.author);

    let language = client.getLanguage(message.data.guild.lang || client.config.DEFAULT_SETTINGS.lang);
    
    const cmd = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName));
    if(!cmd) return;

    if(client.permissions[cmd.config.permission] && !client.permissions[cmd.config.permission](message.member, client)) return message.reply(language.get('errors', 'no_permission', {p: cmd.config.permission}))

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
    }
    
    cmd.run(language, message, args);
  }
}