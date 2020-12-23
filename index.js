require('dotenv').config();
const path = require('path');

const { Client } = require('./structure/Bot');
let client = new Client();

client.loadEvents(path.join(__dirname, 'src/events'));
client.loadCommands(path.join(__dirname, 'src/commands'));
client.loadLanguages(path.join(__dirname, 'src/languages'));

client.db.init();

client.login(process.env.TOKEN)