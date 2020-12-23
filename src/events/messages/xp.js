const Client = require('../../../structure/Client');
const { Event, Embed } = require('../../../structure/Bot');
const { Message } = require('discord.js');

const cooldown = new Set();

function getRandomLevelUpMessage(user, level, role) {
  let messagesList = [`> **GG ${user}! Tu viens de passer niveau ${level}!**`];
  let message = messagesList[Math.floor(Math.random() * messagesList.length)];
  if(role) message += ` Tu as obtenu le grade **${role.name}**!`
  return message;
}

module.exports = class extends Event {

  constructor() {
    super('xp');
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   */
  async run(client, message) {
    if(!message.data) return;
    if(cooldown.has(message.author.id)) return;

    let experience = new Number(message.data.member.experience || 0);
    let level = new Number(message.data.member.level || 1);
    let max = client.functions.xpMax(level);
    let win = Math.floor(Math.random() * 5)+1 * 50;

    experience = experience + win;
    if(experience >= max) {
        level++;
        experience = 0;

        let role;
        if(message.data.guild && message.data.guild.settings && message.data.guild.settings.roleReward) {
          role = message.guild.roles.cache.get(message.data.guild.settings.roleReward[level]);
          if(role && client.functions.canGiveRole(role)) message.member.roles.add(role);
        }

        if(role) message.channel.send(message.language.get('general', 'levels.level_up_role', {user: `<@${message.author.id}>`, level, role: role.name}));
        else message.channel.send(message.language.get('general', 'levels.level_up', {user: `<@${message.author.id}>`, level}));
    }

    cooldown.add(message.author.id);

    await client.db.updateMember(message.guild, message.member, {
      'experience': experience,
      'level': level
    })

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, 5000)
  }
}