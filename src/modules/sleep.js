const mineflayer = require("mineflayer");
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("chat", async (username, message) => {
    if (message === "$sleep") {
      if (!bot.isSleeping) {
        const nearbyBed = bot.findBlock({
          matching: bot.isABed,
          maxDistance: 10,
        });

        if (nearbyBed) {
          try {
            await bot.sleep(nearbyBed);
          } catch (error) {
            bot.chat(error.message);
          }
        } else {
          bot.chat("No nearby bed found within 10 blocks. Searching for a new bed...");
          const bedBlock = bot.findBlock({
            matching: bot.isABed,
            maxDistance: 64,
          });
          if (bedBlock) {
            const { x, y, z } = bedBlock.position;
            const movements = new Movements(bot, bot.entity);
            movements.canDig = false;
            movements.allow1by1towers = false;

            bot.pathfinder.setMovements(movements);
            bot.pathfinder.setGoal(new GoalNear(x, y, z, 3));

            bot.once("goal_reached", () => {
              bot.sleep(bedBlock);
            });
          }
        }
      } else {
        bot.chat("Bot is already sleeping.");
      }
    }
  });

  bot.on("sleep", () => {
    bot.chat("Good night.");
  });

  bot.on("wake", () => {
    bot.chat("Good morning.");
  });
};
