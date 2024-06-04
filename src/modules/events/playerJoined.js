const mineflayer = require("mineflayer");
const axios = require("axios");

const { events } = require("../../settings.json");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.once("spawn", () => {
    bot.on("playerJoined", (player) => {
      axios.post(`https://discord.com/api/webhooks/${events}`, {
        username: player.username,
        avatar_url: `https://mineskin.eu/armor/bust/${player.username}/100.png`,
        content: `**${player.username}** joined the game`,
      });

      const time = new Date().toLocaleTimeString();
      console.log(`\x1b[90m[\x1b[0m\x1b[37m${time}\x1b[0m\x1b[90m]\x1b[0m \x1b[38;5;208m${"\x1b[33m" + `Player joined:` + "\x1b[0m"} \x1b[38;5;114m${player.username}\x1b[0m`);
    });
  });
};
