const findPlayer = require('../utils/findPlayer');

module.exports = function () {
  return {
    name: 'near',
    busy: false,
    cooldown: 5,
    /**
     * @param {import('mineflayer').Bot} bot
     * @param {string} sender
     * @param {string[]} args
     */
    execute(bot, sender, args) {
      if (!args.length) {
        return bot.chat(`${sender}, you need to specify a player in the server.`);
      }

      const target = args[0];
      const info = findPlayer(bot, target);

      if (info) {
        bot.chat(`${info.username} located at (${info.x}, ${info.y}, ${info.z}). They are ${info.distance} blocks away.`);
      } else {
        bot.chat(`${target} is not in my view distance.`);
      }
    },
  };
};
