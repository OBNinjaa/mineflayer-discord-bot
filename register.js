const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./settings.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log(`Successfully reloaded ${commands.length} application (/) commands.`);

    const existingCommands = await rest.get(Routes.applicationCommands(clientId));

    for (const command of existingCommands) {
      if (!commands.some((c) => c.name === command.name)) {
        console.log(`Deleting command ${command.name}`);
        await rest.delete(Routes.applicationCommand(clientId, command.id));
      }
    }
  } catch (error) {
    console.error(error);
  }
})();
