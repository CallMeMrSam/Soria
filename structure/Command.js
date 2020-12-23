const Client = require('./Client');

module.exports = class {
  /**
   * 
   * @param {Client} client Client
   */
  constructor(client, {
    name = "",
    module = "default",
    aliases = new Array(),
    usage = new Array(),
    flags = new Array(),

    permission = "user",

    enabled = true
  }) {
    this.client = client;
    this.info = { name, module, aliases, usage, flags }
    this.config = { permission, enabled };
  }
}