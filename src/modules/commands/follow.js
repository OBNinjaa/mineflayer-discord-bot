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
        if (args.length === 0) {
          bot.chat("Please specify a player.");
          return;
        }

        try {
          const movements = new Movements(bot);

          movements.allow1by1towers = true;
          movements.allowParkour = true;
          movements.canDigLadders = true;
          movements.canOpenDoors = true;
          movements.canDig = true;

          const playerPosition = bot.players[args[0]].entity.position;

          bot.pathfinder.setMovements(movements);
          bot.pathfinder.setGoal(
            new GoalNear(
              playerPosition.x,
              playerPosition.y,
              playerPosition.z,
              0
            )
          );

          bot.once("goal_reached", () => {
            const { x, y, z } = playerPosition;
            console.log(
              `\x1b[38;5;208m${
                "\x1b[33m" + `Arrived at ${username} position:` + "\x1b[0m"
              } \x1b[32m${x}, ${y}, ${z}\x1b[0m`
            );
            if (!bot.config.silent) {
              bot.chat("I have arrived!");
            }
          });
        } catch (error) {
          console.log(
            `\x1b[38;5;208m${
              "\x1b[33m" + `Error while following ${username}:` + "\x1b[0m"
            } \x1b[31m${error.message}\x1b[0m`
          );
          if (!bot.config.silent) {
            bot.chat(
              "Sorry I can't follow you! Could be that you're too far away!"
            );
          }
        }
      }
    }
  });
};

module.exports.command = {
  name: "follow",
  description: "Have the bot move to a player.",
  usage: ">follow <player>",
};
