/**
 * @author CallMeMrSam
 */
const Client = require('../../../structure/Client');
const Language = require('../../../structure/Language');
const { Command, Embed } = require('../../../structure/Bot');
const { Message } = require('discord.js');

const dayjs = require('dayjs');

module.exports = class extends Command {
    
  /**
   * Command
   * @param {Client} client 
   */
  constructor(client) {
    super(client, {
      name: "userinfo",
      aliases: ['ui'],
      usage: ['userinfo', 'userinfo <@user>']
    });
  }

  /**
   * Exécuter la commande
   * @param {Language} language
   * @param {Message} message 
   * @param {String[]} args 
   */
  async run(language, message, args) {
    let user = this.client.users.cache.get(args[0]) || message.mentions.users.first() || message.author;
    
    let badges = message.author.badges;
    if(user.id !== message.author.id) badges = this.client.globalBadges.getUserBadges(user, this.client, await this.client.db.getUser(message.author.id))

    let avatarURL = user.avatarURL();
    let username = user.username;
    let tag = user.discriminator;
    let id = user.id;
    let creationDate = dayjs(user.createdAt).format(language.get('general', 'time.format')).toString();
    
    let infos = new Embed(this.client, 'main', language)
      .setAuthor(user.tag, avatarURL)
      .addField(language.get('commands', 'userinfo.username'), `> \`${username}\``, true)
      .addField(language.get('commands', 'userinfo.tag'), `> \`${tag}\``, true)
      .addField(language.get('commands', 'userinfo.id'), `> \`${id}\``, true)
    
    if(badges.length > 0) infos.setDescription(language.get('general', 'global_badges', { b: badges.join(' ') }))

    if(message.guild.members.cache.get(id)) {
      let member = message.guild.members.cache.get(id);

      let rolesSize = member.roles.cache.filter(x => x.id !== x.guild.id).size;
      let roles = member.roles.cache.filter(x => x.id !== x.guild.id).map(x => x).sort((a, b) => a.position - b.position).join(', ')
      if(!roles) roles = language.get('commands', 'userinfo.no_role');
      let joinDate = dayjs(member.joinedAt).format(language.get('general', 'time.format')).toString();

      infos
        .setColor(member.displayHexColor)
        .addField(language.get('commands', 'userinfo.roles') + ` (${rolesSize})`, `> ${roles}`)
        .addField(language.get('commands', 'userinfo.join_date'), `> ${joinDate}`)
    }
    infos
      .addField(language.get('commands', 'userinfo.creation_date'), `> ${creationDate}`)
      .sender(message.author)
      .sendIn(message.channel)
  }
}