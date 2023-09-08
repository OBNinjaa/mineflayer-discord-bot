const mineflayer = require("mineflayer");
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;

/**
 * @param {mineflayer.Bot} bot
 */
module.exports = (bot) => {
  bot.on("chat", (username, message) => {
    if (message === "$come" || message === "$follow") {
      const player = bot.players[username];

      if (player && player.entity) {
        const playerPosition = player.entity.position;
        const movements = new Movements(bot, bot.entity);

        bot.pathfinder.setMovements(movements);
        bot.pathfinder.setGoal(new GoalNear(playerPosition.x, playerPosition.y, playerPosition.z, 0));
      } else {
        if (player) {
          bot.chat(`Where are you ${username}?`);
        } else {
          return;
        }
      }
    }
  });
};
