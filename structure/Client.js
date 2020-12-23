const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const Logger = require('./Logger');
const path = require('path');

const Language = require('./Language');

var commandsCache = {};
var categoriesCache = [];
var languagesCahe = {};
var modules = [];

module.exports = class extends Client {
  constructor(opt) {
    super(opt);

    this.config = require('../utils/config');
    this.constants = require('../utils/constants');
    this.functions = require('../utils/functions');
    this.permissions = require('../utils/permissions');

    this.logger = new Logger();
    this.db = new (require('../utils/mongoose'))(this);

    this.commands = new Collection();
    this.aliases = new Collection();
    this.events = new Collection();
  }

  /**
   * Charger les commandes.
   * @param {string} src Chemin du dossier des commandes
   */
  loadCommands(src) {
    readdirSync(src).forEach(async (category) => {
      await readdirSync(path.join(src, category)).forEach((file) => {
        if(file.split('.').pop() !== 'js') return this.logger.error(`Invalid file ${file}`);

        let cmd = new (require(path.join(src, category, file)))(this);

        cmd.info.category = category;
        this.commands.set(cmd.info.name, cmd);
        cmd.info.aliases.forEach((a) => this.aliases.set(a, cmd.info.name));
        this.logger.success(`Command ${cmd.info.name} loaded`);
        
        if(!modules.includes(cmd.info.module)) modules.push(cmd.info.module);
        if(!commandsCache[cmd.info.category]) {
          categoriesCache.push(this.constants.HELP[cmd.info.category] ? Object.assign({id: cmd.info.category}, this.constants.HELP[cmd.info.category]) : {id: cmd.info.category, name: cmd.info.category, emoji: '📄', pos: 99});
          commandsCache[cmd.info.category] = [];
        }
        commandsCache[cmd.info.category].push(cmd.info);
      })
    })
  }

  /**
   * Charger les evénements.
   * @param {string} src Chemin du dossier des evénements
   */
  loadEvents(src) {
    readdirSync(src).forEach(async (category) => {
      await readdirSync(path.join(src, category)).forEach((file) => {
        if(file.split('.').pop() !== 'js') return this.logger.error(`Invalid file ${file}`);
        let event = new (require(path.join(src, category, file)))();
        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
        this.logger.success(`Event ${event.name} loaded`);
      })
    })
  }

  /**
   * Charger les langues. 
   * @param {string} src Chemin du dossier des langues
   */
  loadLanguages(src) {
      readdirSync(src).forEach(l => {
          languagesCahe[l] = new Language(l, src);
      })
  }

  /**
   * Récupérer un language
   * @param {string} language La language a récupérer
   * @returns {Language}
   */
  getLanguage(language) {
      if(!language) return languagesCahe['en'];
      return languagesCahe[language];
  }


  get getCommands() {
    return commandsCache;
  }
  get getCategories() {
    return categoriesCache;
  }
  get getModules() {
    return modules;
  }

  static get getModules() {
    return modules;
  }
}