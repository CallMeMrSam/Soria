const Client = require('./Client');

module.exports = class {
  /**
   * 
   * @param {Client} client Client
   */
  constructor(client, {
    name = "",
    aliases = new Array(),
    usage = new Array(),
    flags = new Array(),

    permission = "user",
    module = "default",

    enabled = true,
    moduleInfoHidden = false
  }) {
    this.client = client;
    this.info = { name, aliases, usage, flags, category: "unlisted" }
    this.config = { permission, enabled, module, moduleInfoHidden };
  }
}