const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { token } = require("./config.json");

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const commands = await client.application.commands.fetch();
  for (const command of commands) {
    console.log(command);
  }

  const commandName = "ping";
  const command = commands.find((cmd) => cmd.name === commandName);

  if (command) {
    await command.delete();
    console.log(`Deleted command "${commandName}"`);
    process.exit(0);
  } else {
    console.log(`Command "${commandName}" not found`);
  }
});

client.login(token);
