const mineflayer = require("mineflayer");
const colors = require("colors");
const request = require("request");

const { eventshook, host } = require("../../config.json");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("messagestr", (message, messagePosition, jsonMsg) => {
    if (jsonMsg.json.translate === "death.attack.player") {
      console.log(`[${new Date().toLocaleTimeString().gray}] ${message.magenta}`);
      var URL = eventshook;
      request.post(URL, {
        json: {
          content: null,
          embeds: [
            {
              title: `**${jsonMsg.json.with[0].insertion} Killed**`,
              description: `**${message}**`,
              color: 16276813,
              footer: {
                text: `${new Date().toLocaleTimeString()}`,
              },
              thumbnail: {
                url: `https://mc-heads.net/head/${jsonMsg.json.with[0].insertion}`,
              },
            },
          ],
          attachments: [],
        },
      });
    }

    // Admin Kill
    if (jsonMsg.json.translate === "chat.type.admin") {
      console.log(`[${new Date().toLocaleTimeString().gray}] ${message.magenta}`);
      var URL = eventshook;
      request.post(URL, {
        json: {
          content: null,
          embeds: [
            {
              title: `**OP Killed ${jsonMsg.json.with[0].insertion}**`,
              description: `**${message}**`,
              color: 16276813,
              footer: {
                text: `${new Date().toLocaleTimeString()}`,
              },
              thumbnail: {
                url: `https://mc-heads.net/head/${jsonMsg.json.with[0].insertion}`,
              },
            },
          ],
          attachments: [],
        },
      });
    }
  });
};
