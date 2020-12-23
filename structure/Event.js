const Client = require('./Client');

module.exports = class {
  /**
   * 
   * @param {string} name event's name
   */
  constructor(name) {
    this.name = name;
  }
}