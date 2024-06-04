const mineflayer = require("mineflayer");
const axios = require("axios");

const { messages } = require("../../settings.json");

const REGEX =
  /\bhttps?:\/\/[^\s<>()]+(?:\([\w\d]+\)|([^[:punct:]\s]|[^<>()\[\]]))/i;

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  const SPAM_LIMIT = 10;
  const TIME_FRAME = 60 * 1000;
  const COOLDOWN = 10 * 60 * 1000;

  let messageCount = {};
  let timeout = {};

  bot.on("chat", (username, message) => {
    if (!bot.config.silent) return;
    if (timeout[username]) return;

    if (!messageCount[username]) {
      messageCount[username] = 0;
    }
    messageCount[username]++;

    if (messageCount[username] > SPAM_LIMIT) {
      axios
        .post(`https://discord.com/api/webhooks/${messages}`, {
          username: "Spam detection",
          content: `Too many messages from ${username}. Stopping due to spam. Will resume in 10 minutes.`,
        })
        .catch((error) => {
          console.log(
            `\x1b[38;5;208m${
              "\x1b[33m" + `Error while sending webhook:` + "\x1b[0m"
            } \x1b[31m${error.message}\x1b[0m`
          );
        });

      timeout[username] = setTimeout(() => {
        delete timeout[username];
        delete messageCount[username];
      }, COOLDOWN);
      return;
    }

    const time = new Date().toLocaleTimeString();
    console.log(
      `\x1b[90m[\x1b[0m\x1b[37m${time}\x1b[0m\x1b[90m]\x1b[0m \x1b[38;5;31m${username}\x1b[0m\x1b[0m \x1b[38;5;224m${message.replace(
        REGEX,
        "[URL REDACTED]"
      )}\x1b[0m`
    );

    if (messages) {
      axios
        .post(`https://discord.com/api/webhooks/${messages}`, {
          username: username,
          content: message.replace(REGEX, "[URL REDACTED]"),
          avatar_url: `https://mineskin.eu/armor/bust/${username}/100.png`,
        })
        .catch((error) => {
          console.log(
            `\x1b[38;5;208m${
              "\x1b[33m" + `Error while sending webhook:` + "\x1b[0m"
            } \x1b[31m${error.message}\x1b[0m`
          );
        });
    }

    setTimeout(() => {
      messageCount[username] = 0;
    }, TIME_FRAME);
  });
};
