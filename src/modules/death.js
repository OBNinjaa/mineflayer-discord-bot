const mineflayer = require("mineflayer");
const request = require("request");
const path = require("path");
const fs = require("fs");

const { events } = require("../settings.json");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("message", (jsonMsg, position) => {
    if (position !== "system") return;

    const message = jsonMsg.toString();
    const deaths = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "deaths.json"), "utf8"));

    function checkDeathMatch(deathMessage, deathPatterns) {
      if (!Array.isArray(deathPatterns)) {
        deathPatterns = [deathPatterns];
      }

      for (const pattern of deathPatterns) {
        const regex = new RegExp(pattern.replace("P1", "(\\w+)").replace("P2", "(\\w+)").replace("P3", "(\\w+)"));
        if (regex.test(deathMessage)) {
          console.log("\x1b[33m%s\x1b[0m", deathMessage);
          const username = deathMessage[0].toUpperCase() + deathMessage.substring(1).split(" ")[0];
          try {
            request.post(events, {
              json: {
                username: username,
                content: `${deathMessage}`,
                avatar_url: `https://mc-heads.net/head/${username}`,
              },
            });
          } catch (error) {
            console.log("\x1b[31mUnable to send webhook to Discord\x1b[0m");
            console.log("\x1b[31mMake sure you have a valid webhook in your config \x1b[0m");
          }
        }
      }
    }

    checkDeathMatch(message, deaths);
  });
};
