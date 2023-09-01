const mineflayer = require("mineflayer");
const request = require("request");
const { messages } = require("../settings.json");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("chat", (username, message) => {
    if (!message.includes("https")) {
      console.log(`\x1b[33m${username} : \x1b[35m${message}\x1b[0m`);
      try {
        request.post(messages, {
          json: {
            content: message,
            username: username,
            avatar_url: `https://mc-heads.net/head/${username}`,
          },
        });
      } catch (error) {
        console.log("\x1b[31mUnable to send webhook to Discord\x1b[0m");
        console.log("\x1b[31mMake sure you have a valid webhook in your config \x1b[0m");
      }
    }
  });
};
