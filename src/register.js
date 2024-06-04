const { REST, Routes } = require("discord.js");
const { clientID, token } = require("./settings.json");
const fs = require("node:fs");
const path = require("node:path");

const rest = new REST().setToken(token);

function askQuestion(question) {
  process.stdout.write(question);

  process.stdin.once("data", (data) => {
    const answer = data.toString().trim().toLowerCase();
    console.log(`\x1b[38;5;208m${"\x1b[33m" + `Answer: ${answer}` + "\x1b[0m"}`);

    if (answer === "r" || answer === "register") {
      console.clear();
      registerCommands();
    } else if (answer === "d" || answer === "delete") {
      console.clear();
      deleteCommands();
    } else {
      console.log(`\x1b[38;5;208m${"\x1b[33m" + `Invalid input. Please try again.` + "\x1b[0m"}`);
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
        console.log(`\x1b[38;5;208m${"\x1b[33m" + `Warning: ${filePath} is missing a required "data" or "execute" property.` + "\x1b[0m"}`);
      }
    }
  }

  (async () => {
    try {
      console.log(`\x1b[38;5;208m${"\x1b[33m" + `Registering commands:` + "\x1b[0m"} \x1b[36m${commands.map((command) => command.name).join(", ")}\x1b[0m`);

      const data = await rest.put(Routes.applicationCommands(clientID), { body: commands });

      console.log(`\x1b[38;5;208m${"\x1b[33m" + `Registered commands:` + "\x1b[0m"} \x1b[36m${data.map((command) => command.name).join(", ")}\x1b[0m`);
      console.log(`\x1b[38;5;208m${"\x1b[33m" + `Make sure to refresh your Discord app in order to see changes.` + "\x1b[0m"}`);
      process.exit(0);
    } catch (error) {
      console.error(error);
    }
  })();
}

function deleteCommands() {
  rest
    .put(Routes.applicationCommands(clientID), { body: [] })
    .then(
      () =>
        console.log(`\x1b[38;5;208m${"\x1b[33m" + `Deleted all commands.` + "\x1b[0m"}`) &&
        console.log(`\x1b[38;5;208m${"\x1b[33m" + `Make sure to refresh your Discord app in order to see changes.` + "\x1b[0m"}`) &&
        process.exit(0)
    )
    .catch(console.error);
}

askQuestion(`\x1b[38;5;208m${"\x1b[33m" + `Do you want to register or delete commands? (r/d) ` + "\x1b[36m"}`);
