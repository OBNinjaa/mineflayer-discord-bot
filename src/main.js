const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const mineflayer = require("mineflayer");

const { token } = require("./settings.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const createBot = require("./bot.js");

client.commands = new Collection();
client.cooldowns = new Collection();

async function initializeBot() {
  const bot = createBot();

  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }

  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, bot));
    } else {
      client.on(event.name, (...args) => event.execute(...args, bot));
    }
  }

  try {
    await client.login(token);
  } catch (error) {
    console.error(error);
  }
}

initializeBot();
