const { Events } = require("discord.js");
const colors = require("colors");
const bot = require("../bot");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`[${new Date().toLocaleTimeString().gray}]`, colors.brightYellow(`discord bot ready: ${client.user.tag.brightGreen}`));

    client.user.setPresence({
      activities: [{ name: `Minecraft`, type: 1 }],
      status: "online",
    });
  },
};
