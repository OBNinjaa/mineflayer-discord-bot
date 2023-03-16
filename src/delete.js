const { REST, Routes } = require("discord.js");
const { clientsID, serverID, token } = require("./config.json");

const rest = new REST({ version: "10" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientsID, serverID), { body: [] })
  .then(() => console.log("Successfully deleted all guild commands."))
  .catch(console.error);
