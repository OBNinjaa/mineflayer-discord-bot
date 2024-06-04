const mineflayer = require("mineflayer");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const { events, logging } = require("../../settings.json");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("message", (jsonMsg, position) => {
    if (!logging) return;
    if (position !== "system") return;

    const message = jsonMsg.toString();
    const deaths = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "data", "deaths.json"), "utf8"));

    function checkDeathMatch(deathMessage, deathPatterns) {
      if (!Array.isArray(deathPatterns)) {
        deathPatterns = [deathPatterns];
      }

      for (const pattern of deathPatterns) {
        const regex = new RegExp(pattern.replace("P1", "(\\w+)").replace("P2", "(\\w+)").replace("P3", "(\\w+)"));
        if (regex.test(deathMessage)) {
          const time = new Date().toLocaleTimeString();
          const username = deathMessage[0].toUpperCase() + deathMessage.substring(1).split(" ")[0];
          console.log(`\x1b[90m[\x1b[0m\x1b[37m${time}\x1b[0m\x1b[90m] \x1b[33m${deathMessage}\x1b[0m`);
          axios
            .post(`https://discord.com/api/webhooks/${events}`, {
              username: username,
              content: `${deathMessage}`,
              avatar_url: `https://mineskin.eu/armor/bust/${username}/100.png`,
            })
            .catch((error) => {
              console.log(`\x1b[38;5;208m${"\x1b[33m" + `Error while sending webhook:` + "\x1b[0m"} \x1b[31m${error.message}\x1b[0m`);
            });
          break;
        }
      }
    }

    checkDeathMatch(message, deaths);
  });
};
