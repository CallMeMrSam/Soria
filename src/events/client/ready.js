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

    let activityIndex = 0;
    let getActivity = (c) => {
      let a = [
        { name: "default prefix: !", type: "WATCHING" },
        { name: `${c.guilds.cache.size} guilds`, type: "WATCHING" },
        { name: `you 🤨`, type: "LISTENING" },
        { name: `with ${c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} users`, type: "PLAYING"}
      ]
      activityIndex++;
      if(activityIndex >= a.length) activityIndex = 0;
      return a[activityIndex];
    }
    client.logger.success(`${client.user.tag} ready.`);

    client.guilds.cache.forEach(async(guild) => {
      await client.db.getGuild(guild)
    })

    setInterval(() => {
      client.user.setActivity(getActivity(client));
    }, 60000)
  }
}