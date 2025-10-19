const { globSync } = require('glob');
const path = require('path');

module.exports = function (bot) {
  let commands = [];
  const prefix = bot.config.prefix || '$';
  const cooldowns = new Map();

  return {
    set: () => {
      let files = globSync('./modules/**/*.js');
      files.forEach((file) => {
        commands.push(module.require(path.join(__dirname, file))(bot));
      });
      console.log('Loaded minecraft commands: ' + commands.map((c) => `\x1b[38;5;208m${c.name}\x1b[0m`).join(', '));
    },

    run: (player, input) => {
      if (!input.startsWith(prefix)) return;

      let args = input.slice(prefix.length).trim().split(' ');
      let cmd = args.shift().toLowerCase();
      let matched = commands.find((c) => c.name === cmd);
      if (!matched) return;

      // Only allow managers to access certain commands
      if (!bot.config.managers.includes(player) && matched.manager) {
        bot.chat('You are not allowed to use this command.');
        return;
      }

      if (bot.config.is_busy && matched.busy !== false) {
        bot.chat('I am currently busy executing a task, try again later.');
        return;
      }

      const now = Date.now();
      const userCooldownKey = `${player}:${cmd}`;

      if (cooldowns.has(userCooldownKey)) {
        const expirationTime = cooldowns.get(userCooldownKey);
        if (now < expirationTime) {
          const secondsLeft = Math.round((expirationTime - now) / 1000);

          bot.chat(`${player}, please wait ${secondsLeft}s before using the '${cmd}' command again.`);
          return;
        }
      }

      if (typeof matched.cooldown === 'number' && matched.cooldown > 0) {
        cooldowns.set(userCooldownKey, now + matched.cooldown * 1000);
      }

      matched.execute(bot, player, args);
    },
  };
};
