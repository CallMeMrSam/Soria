/**
 * @author CallMeMrSam
 */
const { Client, Language } = require('./Bot');
const { MessageEmbed, TextChannel, User } = require('discord.js');
const { EMBED } = require('../utils/constants');

module.exports = class extends MessageEmbed {

    /**
     * Constructeur amélioré d'Embed
     * @param {Client} client
     * @param {Language} language
     * @param {string} type
     */
    constructor(client, type, language = undefined, hideFooter = false) {
        super();
        this.client = client;
        if(!language) language = client.getLanguage(client.config.DEFAULT_SETTINGS.lang);
        this.language = language;

        this.type = "custom";

        if(EMBED[type]) this.setColor(EMBED[type])
        if(!hideFooter) this.setFooter(client.user.username);
    }

    /**
     * Editer rapidement l'Embed
     * @param {string} title 
     * @param {string} description 
     */
    fast(title, description) {
        if(description.length > 0) return this.setAuthor(title, this.client.user.avatarURL()).setDescription(description);
        return this.setAuthor(title, this.client.user.avatarURL());
    }

    /**
     * Définir un utilisateur dans le footer.
     * @param {User} user 
     */
    sender(user) {
        if(!user) return this;
        return this.setFooter(`${this.language.get('general', 'embed.sender', { user: user.tag })}${this.footer.text ? ` • ${this.footer.text}` : ''}`, user.displayAvatarURL() || this.footer.iconURL || this.client.user.displayAvatarURL())
    }
    
    /**
     * Définir un author de l'Embed si...
     * @param {boolean} boolean 
     * @param {*} name 
     * @param {string} icon 
     * @param {string} url 
     */
    setAuthorIf(boolean, name, icon, url) {
        if(boolean) return this.setAuthor(name, icon, url)
        return this
    }
    /**
     * Envoyer un Embed.
     * @param {TextChannel} channel 
     */
    sendIn(channel) {
        return channel.send(this);
    }
}