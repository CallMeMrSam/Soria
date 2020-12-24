/**
 * @author CallMeMrSam
 */
const Client = require('../../../structure/Client');
const Language = require('../../../structure/Language');
const { Command, Embed } = require('../../../structure/Bot');
const { Message, MessageEmbed } = require('discord.js');

const clean = (text) => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}

module.exports = class extends Command {
    
  /**
   * Command
   * @param {Client} client Client
   */
  constructor(client) {
    super(client, {
      name: "eval",
      aliases: [],
      usage: ['eval <js>'],
      permission: "botAdmin"
    });
  }

  /**
   * Exécuter la commande
   * @param {Language} language
   * @param {Message} message 
   * @param {String[]} args 
   */
  async run(language, message, args) {

    try{
      const code = args.join(" ");
      let evaled = eval(code);

      if(typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(new MessageEmbed()
        .setColor('#4cdb45')
        .setTitle('Success')
        .addField('Input:', `\`\`\`js\n${code}\`\`\``)
        .addField('Output:', `\`\`\`xl\n${clean(evaled)}\`\`\``))
      console.log('------------------------------\nEval Output\n------------------------------\n', evaled)
        
    } catch(err){
      message.channel.send(new MessageEmbed()
        .setColor('#db4545')
        .setTitle('Error!')
        .addField('Input:', `\`\`\`js\n${args.join(" ")}\`\`\``)
        .addField('Output:', `\`\`\`xl\n${clean(err)}\`\`\``))
      console.log('------------------------------\nEval Output\n------------------------------\n', err)
    }
  }
}