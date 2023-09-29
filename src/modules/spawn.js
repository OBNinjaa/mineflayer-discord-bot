const mineflayer = require("mineflayer");
const request = require("request");
const { events } = require("../settings.json");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.once("spawn", () => {
    console.log(`Logged in to \x1b[34m${bot._client.socket._host ? null : bot._client.socket.remoteAddress}\x1b[0m as \x1b[32m${bot.username}\x1b[0m`);
    bot.on("playerJoined", (player) => {
      console.log(`\x1b[33m${player.username} joined the game\x1b[0m`);
      try {
        request.post(events, {
          json: {
            content: `${player.username} joined the game`,
            username: `${player.username}`,
            avatar_url: `https://mc-heads.net/head/${player.username}`,
          },
        });
      } catch (error) {
        console.log("\x1b[31mUnable to send webhook to Discord\x1b[0m");
        console.log("\x1b[31mMake sure you have a valid webhook in your config \x1b[0m");
      }
    });

    bot.on("playerLeft", (player) => {
      console.log(`\x1b[33m${player.username} left the game\x1b[0m`);
      try {
        request.post(events, {
          json: {
            content: `${player.username} left the game`,
            username: `${player.username}`,
            avatar_url: `https://mc-heads.net/head/${player.username}`,
          },
        });
      } catch (error) {
        console.log("\x1b[31mUnable to send webhook to Discord\x1b[0m");
        console.log("\x1b[31mMake sure you have a valid webhook in your config \x1b[0m");
      }
    });
  });
};
