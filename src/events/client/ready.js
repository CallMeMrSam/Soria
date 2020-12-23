const Client = require('../../../structure/Client');
const { Event } = require('../../../structure/Bot');

module.exports = class extends Event {

  constructor() {
    super('ready');
  }

  /**
   * 
   * @param {Client} client 
   */
  run(client) {
    client.logger.success(`${client.user.tag} ready.`);
    client.user.setActivity({ name: "Saturn's Stronghold", type: 'WATCHING' });
  }
}