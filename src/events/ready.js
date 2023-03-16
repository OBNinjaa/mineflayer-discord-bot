const { Events } = require("discord.js");
const colors = require("colors");
const bot = require("../bot");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`[${new Date().toLocaleTimeString().gray}]`, colors.brightYellow(`discord bot ready: ${client.user.tag.brightGreen}`));

    const activities = ["Minecraft", `Health: ${bot.health}`, `Hearts: ${bot.food}`];

    setInterval(() => {
      const index = Math.floor(Math.random() * (activities.length - 1) + 1);
      client.user.setPresence({
        status: "online",
        activities: [
          {
            name: activities[index],
            type: "PLAYING",
          },
        ],
      });
    }, 30000);
  },
};
