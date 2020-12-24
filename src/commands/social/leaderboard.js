/**
 * @author CallMeMrSam
 */
const Client = require('../../../structure/Client');
const Language = require('../../../structure/Language');
const { Command, Embed } = require('../../../structure/Bot');
const { Message } = require('discord.js');

let usersCache = {};
let lastUpdate = {};

module.exports = class extends Command {
    
  /**
   * Command
   * @param {Client} client Client
   */
  constructor(client) {
    super(client, {
      name: "leaderboard",
      aliases: ['top'],
      usage: ['leaderboard levels', 'leaderboard reputation', 'leaderboard money'],
      module: 'social'
    });
  }

  /**
   * Exécuter la commande
   * @param {Language} language
   * @param {Message} message 
   * @param {String[]} args 
   */
  async run(language, message, args) {
    let type = args.shift();
    if(!type) type = '';

    function updateCache() {
      if(!lastUpdate[message.guild.id] || lastUpdate[message.guild.id] == 0 || (new Date().getTime() - lastUpdate[message.guild.id]) >= 300000) {
        let data = message.data.guild.users
        lastUpdate[message.guild.id] = new Date().getTime() 
  
        usersCache[message.guild.id] = data.map((x) => ({id: x.id, level: x.level || 1, xp: x.xp || 0, reputation: x.reputation || 0, money: x.money }))
      }
    }

    let lb = [];
    let _lb = [];
    let userRank = [];

    switch(type.toLowerCase()) {
      case 'rep':
      case 'reputation':
        updateCache()
        lb = usersCache[message.guild.id].sort((a, b) => b.reputation - a.reputation);
        _lb = lb.map(x => x.id)
        userRank = _lb.indexOf(message.author.id) != -1 ? '#' + (_lb.indexOf(message.author.id) + 1) : language.get('commands', 'leaderboard.messages.out_of_leaderboard');
        if(lb.length >= 10) lb.length = 10;

        new Embed(this.client, 'main')
          .fast(language.get('commands', 'leaderboard.reputation_title'), lb.map((u, i) => `#${i+1} • <@${u.id}> • **${u.reputation}** ❤`).join('\n'))
          .addField(language.get('commands', 'leaderboard.messages.your_position'), `> **${userRank}**`)
          .setFooter(language.get('commands', 'leaderboard.messages.update'))
          .sendIn(message.channel)
        break;
      case 'level':
      case 'levels':
        updateCache()
        lb = usersCache[message.guild.id].sort((a, b) => {
          if((b.level - a.level) === 0) return b.xp - a.xp;
          return b.level - a.level
        });
        _lb = lb.map(x => x.id)
        userRank = _lb.indexOf(message.author.id) != -1 ? '#' + (_lb.indexOf(message.author.id) + 1) : language.get('commands', 'leaderboard.messages.out_of_leaderboard');
        if(lb.length >= 10) lb.length = 10;

        new Embed(this.client, 'main')
          .fast(language.get('commands', 'leaderboard.levels_title'), lb.map((u, i) => `#${i+1} • <@${u.id}> • Niveau **${u.level}**`).join('\n'))
          .addField(language.get('commands', 'leaderboard.messages.your_position'), `> **${userRank}**`)
          .setFooter(language.get('commands', 'leaderboard.messages.update'))
          .sendIn(message.channel)
        break;
      case 'money':
      case 'cash':
        updateCache()
        lb = usersCache[message.guild.id].sort((a, b) => b.money - a.money);
        _lb = lb.map(x => x.id)
        userRank = _lb.indexOf(message.author.id) != -1 ? '#' + (_lb.indexOf(message.author.id) + 1) : language.get('commands', 'leaderboard.messages.out_of_leaderboard');
        if(lb.length >= 10) lb.length = 10;

        new Embed(this.client, 'main')
          .fast(language.get('commands', 'leaderboard.money_title'), lb.map((u, i) => `#${i+1} • <@${u.id}> • **${u.money}**$`).join('\n'))
          .addField(language.get('commands', 'leaderboard.messages.your_position'), `> **${userRank}**`)
          .setFooter(language.get('commands', 'leaderboard.messages.update'))
          .sendIn(message.channel)
        break;
      default:
        Embed.getHelpEmbedFor('leaderboard', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'no_argument')).sender(message.author).sendIn(message.channel)
        break;
    } 
  }
}