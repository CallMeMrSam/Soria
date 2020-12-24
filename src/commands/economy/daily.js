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
            name: "daily",
            aliases: [],
            usage: ['daily'],
            module: 'economy'
        });
    }

    /**
     * Exécuter la commande
     * @param {Language} language
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(language, message, args) {

    let lastDaily = (+message.data.member.lastDaily || 0);
    
    if(lastDaily == 0 || (new Date().getTime() - lastDaily) >= 86400000) {
      let winMoney = this.client.functions.randomIntFromInterval(100, 300);
      let winXP = this.client.functions.randomIntFromInterval(50, 150);

      let money = (+message.data.member.money || 0) + winMoney;
      let { winLevel, winRole, xp, level } = this.client.functions.levelUp(((+message.data.member.experience || 0) + winXP), (+message.data.member.level || 1), message.member, message.data, this.client);
      
      message.channel.send(`${language.get('commands', 'daily.messages.reward')}\n• **${winMoney}**$\n• **${winXP}**XP${winLevel > 0 ? ` (+${winLevel} ${language.get('commands', 'daily.levels')})` : ''}`);

      await this.client.db.updateMember(message.guild, message.member, {
        'lastDaily': new Date().getTime(),
        'money': money,
        'experience': xp,
        'level': level
      })
    } else {
      return Embed.error(this.client, message.author, language, 'commands', 'daily.messages.time', { time: this.client.functions.msToDurationFormated(((lastDaily + 86400000) - new Date().getTime()), language) }).sendIn(message.channel);
    }
  }
}