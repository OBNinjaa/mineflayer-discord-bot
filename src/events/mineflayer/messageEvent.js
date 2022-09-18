const mineflayer = require("mineflayer");
const colors = require("colors");
const request = require("request");

const { messagehook, host } = require("../../config.json");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    if (message.includes("http")) return;
    console.log(`[${new Date().toLocaleTimeString().gray}] [${username.yellow}] ${message.green}`);

    var URL = messagehook;
    request.post(URL, {
      json: {
        content: null,
        embeds: [
          {
            title: `**${host.toUpperCase()}**`,
            description: `**${username}** : **${message}**`,
            color: 16276813,
            footer: {
              text: `${new Date().toLocaleTimeString()}`,
            },
            thumbnail: {
              url: `https://mc-heads.net/head/${username}`,
            },
          },
        ],
        attachments: [],
      },
    });
  });
};
