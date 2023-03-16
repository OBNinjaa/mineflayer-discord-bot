const mineflayer = require("mineflayer");
const colors = require("colors");
const request = require("request");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    if (username === "chat") username = "Discord";
    if (message.includes("http")) return;
    console.log(`[${new Date().toLocaleTimeString().gray}] [${username.brightBlue}] ${message.brightYellow}`);

    var URL = "https://discord.com/api/webhooks/1003451750214283284/OiQjETezqCL4N7vMt4o4A4YqY73xLVHQFneML1RsJ8rxCTlxzPgPqqMCewR5pdyNcYY9";
    request.post(URL, {
      json: {
        content: `${message}`,
        username: `${username}`,
        avatar_url: `https://mc-heads.net/head/${username}`,
      },
    });
  });
};
