const mineflayer = require('mineflayer');

/**
 * @param {mineflayer.Bot} bot
 */
module.exports = function () {
  return {
    name: 'say',
    busy: false,
    cooldown: 10,
    /**
     * @param {mineflayer.Bot} bot
     * @param {string} sender
     * @param {string[]} args
     */
    execute(bot, sender, args) {
      if (!args.length) return bot.chat(`${sender} you need to specify something to say.`);
      if (!bot.config.can_run_commands && args[0].startsWith('/')) return bot.chat('I cannot run commands.');
      const message = args.join(' ').slice(0, 256);
      bot.chat(message);
    },
  };
};
