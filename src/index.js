const mineflayer = require("mineflayer");
const colors = require("colors");
const path = require("path");
const fs = require("fs");

const { Client, Collection, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

if (Number(process.version.slice(1).split(".")[0]) < 10 && Number(process.version.slice(1).split(".")[0]) < 4) {
  throw new Error("You must be using node version 10.4.0 or higher to use this bot.");
}

const config = require("./config.json");
const { host, port, version, auth, username, password, messagehook, eventshook, token, prefix, ownername } = config;

console.log(colors.yellow("Don't fill out the password field in config.json if you're using a non premium account.\nAnd set auth to mojang also!"));

function ScriptsLoad(bot) {
  const EVENTS_DIR = path.join(__dirname, "events/mineflayer");

  const events = fs
    .readdirSync(EVENTS_DIR)
    .filter((x) => x.endsWith(".js"))
    .map((pluginName) => require(path.join(EVENTS_DIR, pluginName)));

  bot.loadPlugins(events);

  console.log(`[${new Date().toLocaleTimeString().gray}] ${`Loaded ${events.length} events`.green}`);
}

function initialize() {
  let bot = mineflayer.createBot({
    host: host,
    version: version,
    port: port || null,
    auth: auth,
    username: username,
    password: password || null,
    hideErrors: true,
    physicsEnabled: true,
  });

  module.exports = bot;
  ScriptsLoad(bot);

  bot.on("end", (reason) => {
    console.log(`[${new Date().toLocaleTimeString().gray}] ${`Disconnected`.red}`, colors.yellow(`Attemp to reconnect in 5 seconds ${reason}`));
    setTimeout(() => initialize(), 5000);
  });
}

initialize();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

/**
 * @description All event files of the event handler.
 * @type {String[]}
 */

const eventFiles = fs.readdirSync("./src/events/discord").filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/discord/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, async (...args) => await event.execute(...args, client));
  }
}
client.commands = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.cooldowns = new Collection();
client.triggers = new Collection();

/**
 * @type {String[]}
 * @description All command categories aka folders.
 */

const commandFolders = fs.readdirSync("./src/commands");

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.login(token);

module.exports = client;
