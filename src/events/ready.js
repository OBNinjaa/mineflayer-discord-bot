const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Discord bot ready \x1b[32m${client.user.username}\x1b[0m`);
    client.user.setActivity("Minecraft", { type: ActivityType.Playing });
  },
};
