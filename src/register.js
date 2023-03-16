const { REST, Routes } = require("discord.js");
const { token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
const bot = require("./client");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Routes.applicationGuildCommands("817614688027410452", "883397209306038272"), { body: commands });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
})();
