/**
 * @author CallMeMrSam
 */
const Client = require('../../../structure/Client');
const Language = require('../../../structure/Language');
const { Command, Embed } = require('../../../structure/Bot');
const { Message } = require('discord.js');

let choices = ['rock', 'paper', 'scissors'];

module.exports = class extends Command {
    
    /**
     * Command
     * @param {Client} client Client
     */
    constructor(client) {
        super(client, {
            name: "rps",
            aliases: ["rock-paper-scissors"],
            usage: ['rps rock', 'rps paper', 'rps scissors'],
            module: "games"
        });
    }

    /**
     * Exécuter la commande
     * @param {Language} language
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(language, message, args) {
      if(!args[0] || !choices.includes(args[0].toLowerCase())) return Embed.getHelpEmbedFor('rps', message.prefix, language, this.client).fast(language.get('general', 'error_embed_title'), language.get('errors', 'no_argument')).sender(message.author).sendIn(message.channel);
      
      let userChoice = args[0].toLowerCase();
      let botChoice = choices[Math.floor(Math.random() * choices.length)];

      function c(a, b) {
        return (botChoice === a && userChoice === b)
      }

      if(c('rock', 'paper') || c('paper', 'scissors') || c('scissors', 'rock')) {
        new Embed(this.client, 'success', language)
          .fast(language.get('commands', 'rps.title'), '')
          .addField(language.get('commands', 'rps.messages.user_choice'), `> **${language.get('commands', `rps.${userChoice}`)}**`, true)
          .addField(language.get('commands', 'rps.messages.bot_choice'), `> **${language.get('commands', `rps.${botChoice}`)}**`, true)
          .addField(language.get('commands', 'rps.messages.result'), `> **${language.get('commands', 'rps.messages.user_win')}**`)
          .sender(message.author)
          .sendIn(message.channel)
      }
      else if(userChoice === botChoice) {
        new Embed(this.client, 'error', language)
          .fast(language.get('commands', 'rps.title'), '')
          .setColor('#797979')
          .addField(language.get('commands', 'rps.messages.user_choice'), `> **${language.get('commands', `rps.${userChoice}`)}**`, true)
          .addField(language.get('commands', 'rps.messages.bot_choice'), `> **${language.get('commands', `rps.${botChoice}`)}**`, true)
          .addField(language.get('commands', 'rps.messages.result'), `> **${language.get('commands', 'rps.messages.equality')}**`)
          .sender(message.author)
          .sendIn(message.channel)
      }
      else {
        new Embed(this.client, 'error', language)
          .fast(language.get('commands', 'rps.title'), '')
          .addField(language.get('commands', 'rps.messages.user_choice'), `> **${language.get('commands', `rps.${userChoice}`)}**`, true)
          .addField(language.get('commands', 'rps.messages.bot_choice'), `> **${language.get('commands', `rps.${botChoice}`)}**`, true)
          .addField(language.get('commands', 'rps.messages.result'), `> **${language.get('commands', 'rps.messages.bot_win')}**`)
          .sender(message.author)
          .sendIn(message.channel)
      }
    }
}