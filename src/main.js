const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, ActivityType, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });
const { token, clientID } = require("./settings.json");
const minecraft = require("./minecraft");

client.on("ready", (client) => {
  console.log(`\x1b[38;5;208m${"\x1b[33m" + `Discord ready:` + "\x1b[0m"} \x1b[32m${client.user.username}\x1b[0m`);
  client.user.setActivity({ type: ActivityType.Custom, name: "custom", state: "Mineflayer Discord Bot" });
  client.application?.commands.fetch().catch(console.error);

  const bot = minecraft.initialize();

  client.commands = new Collection();
  client.cooldowns = new Collection();

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
});

client.login(token);
