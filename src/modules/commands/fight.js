const mineflayer = require("mineflayer");
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;

const { prefix, master } = require("../../settings.json");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("chat", (username, message) => {
    if (message.startsWith(prefix)) {
      const args = message.slice(1).split(" ");
      const commandName = args.shift().toLowerCase();

      if (
        commandName === `${module.exports.command.name}` &&
        master.includes(username)
      ) {
        const selectedPlayer = args[0];
        const player = bot.players[selectedPlayer];

        if (player) {
          if (!bot.config.silent) {
            console.log(
              `\x1b[38;5;208m${
                "\x1b[33m" + `Fighting:` + "\x1b[0m"
              } \x1b[32m${selectedPlayer}\x1b[0m`
            );
          } else {
            bot.chat(`I am now fighting **${selectedPlayer}**`);
          }
          bot.pvp.attack(player.entity);
        }

        bot.once("stoppedAttacking", () => {
          if (!bot.config.silent) {
            console.log(
              `\x1b[38;5;208m${
                "\x1b[33m" + `Stopped fighting:` + "\x1b[0m"
              } \x1b[32m${selectedPlayer}\x1b[0m`
            );
          } else {
            bot.chat(`I have stopped fighting **${selectedPlayer}**`);
          }
        });
      }
    }
  });
};

module.exports.command = {
  name: "fight",
  description: "Have the bot fight a player that is in range.",
  usage: ">fight <player>",
};
