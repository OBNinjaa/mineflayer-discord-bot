const mineflayer = require('mineflayer');

/**
 * @param {mineflayer.Bot} bot
 */
module.exports = function (bot) {
  return {
    name: 'say',
    /**
     * @param {mineflayer.Bot} bot
     * @param {string} sender
     * @param {string[]} args
     */
    execute(bot, sender, args) {
      if (!args.length) return bot.chat(`${sender} you need to specify something to say.`);
      bot.chat(args.join(' '));
    },
  };
};
