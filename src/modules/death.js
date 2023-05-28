const mineflayer = require("mineflayer");
const colors = require("colors");
const request = require("request");

/**
 * @param {mineflayer.Bot} bot
 */

const options = require("../config.json");
const { eventshook } = options;

module.exports = (bot) => {
  const deathMessages = [
    {
      regex: /(.+) was slain by (.+)/,
      logMessage: (victim, attacker) =>
        `[${new Date().toLocaleTimeString().gray}] ${victim.brightRed.bold} ${"was slain by".brightYellow} ${attacker.brightRed.bold}`,
      discordMessage: (victim, attacker) => `${victim} was slain by ${attacker}`,
    },
    {
      regex: /(.+) was shot by (.+)/,
      logMessage: (victim, attacker) =>
        `[${new Date().toLocaleTimeString().gray}] ${victim.brightRed.bold} ${"was shot by".brightYellow} ${attacker.brightRed.bold}`,
      discordMessage: (victim, attacker) => `${victim} was shot by ${attacker}`,
    },
    {
      regex: /(.+) was squashed by a falling anvil( whilst fighting (.+))?/,
      logMessage: (victim, _, attacker) =>
        `[${new Date().toLocaleTimeString().gray}] ${victim.brightRed.bold} ${"was squashed by a falling anvil".brightYellow} ${
          attacker ? "whilst fighting".brightYellow + " " + attacker.brightRed.bold : ""
        }`,
      discordMessage: (victim, _, attacker) => `${victim} was squashed by a falling anvil${attacker ? " whilst fighting " + attacker : ""}`,
    },
  ];

  bot.on("message", (jsonMsg, position) => {
    if (position !== "system") return;

    const message = jsonMsg.toString();
    const deathMatch = deathMessages.find(({ regex }) => regex.test(message));

    if (deathMatch) {
      const [, victim, attacker] = deathMatch.regex.exec(message);

      console.log(deathMatch.logMessage(victim, attacker));

      request.post(eventshook, {
        json: {
          content: deathMatch.discordMessage(victim, attacker),
          //   avatar_url: `https://mc-heads.net/head/${victim}`,
        },
      });
    }
  });
};
