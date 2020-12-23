/**
 * @author CallMeMrSam
 */
const Client = require('./Client');
const Language = require('./Language');
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

    /**
     * Créer un embed d'erreur
     * @param {Client} client Client
     * @param {User} sender Sender
     * @param {Language} language language
     * @param {string} file Language file
     * @param {string} path yaml path
     * @param {object} data data
     */
    static error(client, sender, language, file, path, data = {}) {
        return new this(client, 'error', language).setTitle(language.get('general', 'error_embed_title')).setDescription(language.get(file, path, data)).sender(sender);
    }

    /**
     * Créer un embed de succès
     * @param {Client} client Client
     * @param {User} sender Sender
     * @param {Language} language language
     * @param {string} file Language file
     * @param {string} path yaml path
     * @param {object} data data
     */
    static success(client, sender, language, file, path, data = {}) {
        return new this(client, 'success', language).setTitle(language.get('general', 'success_embed_title')).setDescription(language.get(file, path, data)).sender(sender);
    }

    /**
     * 
     * @param {string} cmd Command
     * @param {Language} language Language
     * @param {Client} client client
     */
    static getHelpEmbedFor(cmd, prefix, language, client) {
        let command = client.commands.get(cmd);

        let category = client.getCategories.find(i => i.id === command.info.category);
        if(category) category.name = language.get('categories', command.info.category)

        let help = new this(client, "main", language)
            .addField(language.get('help', 'name'), `> \`${command.info.name}\``, true)
            .addField(language.get('help', 'aliases'), `> ${command.info.aliases.length > 0 ? command.info.aliases.map(x => `\`${x}\``).join(', '): language.get('help', 'none')}`, true)
            .addField(language.get('help', 'category'), `> \`${category.name}\``, true)
            .addField(language.get('help', 'description'), `> ${language.get('commands', `${command.info.name}.description`) || language.get('help', 'no_description')}`)

        if(command.info.usage.length > 0) {
            help.addField(language.get('help', 'usage'), command.info.usage.map(x => `> \`${prefix}${x}\``).join('\n'))
        }

        if(command.info.flags.length > 0) {
            help.addField(language.get('help', 'flags'), command.info.flags.map((x) => `> \`-${x[0]}\`: **${x[1]}**`))
        }

        if(command.config.module !== 'default') {
            help.addField(language.get('help', 'module'), `> \`${command.config.module}\``)
        }

        if(command.config.permission !== 'user') {
            help.addField(language.get('help', 'permission'), `> \`${command.config.permission}\``)
        }

        return help;
    }
}