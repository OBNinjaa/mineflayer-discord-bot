const { REST, Routes } = require("discord.js");
const { clientID, token } = require("./settings.json");
const fs = require("node:fs");
const path = require("node:path");

const rest = new REST().setToken(token);

function askQuestion(question) {
  process.stdout.write(question);

  process.stdin.once("data", (data) => {
    const answer = data.toString().trim().toLowerCase();
    console.log(`You entered: ${answer}`);

    if (answer === "r" || answer === "register") {
      console.clear();
      registerCommands();
    } else if (answer === "d" || answer === "delete") {
      console.clear();
      deleteCommands();
    } else {
      console.log("You entered an invalid answer. It must be 'register' or 'delete' or their shortcuts 'r' or 'd'.");
      askQuestion(question);
    }
  });
}

function registerCommands() {
  const commands = [];
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }

  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);

      const data = await rest.put(Routes.applicationCommands(clientID), { body: commands });

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
      process.exit(0);
    } catch (error) {
      console.error(error);
    }
  })();
}

function deleteCommands() {
  rest
    .put(Routes.applicationCommands(clientID), { body: [] })
    .then(() => console.log("Successfully deleted all application commands.") && process.exit(0))
    .catch(console.error);
}

askQuestion("Enter register or delete: ");
