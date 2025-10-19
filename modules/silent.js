const mineflayer = require('mineflayer');

/**
 * @param {mineflayer.Bot} bot
 */
module.exports = function () {
  return {
    name: 'silent',
    busy: false,
    cooldown: 1,
    manager: true,
    /**
     * @param {mineflayer.Bot} bot
     * @param {string} sender
     * @param {string[]} args
     */
    execute(bot, sender, args) {
      if (args.length !== 1 || (args[0] !== 'true' && args[0] !== 'false')) {
        return bot.chat(`${sender}, please specify either 'true' to disable chat or 'false' to enable chat.`);
      }

      bot.config.can_send_messages = args[0] === 'false';

      const status = bot.config.chat ? 'enabled' : 'disabled';
      bot.chat(`Chat has been ${status}.`);
    },
  };
};
