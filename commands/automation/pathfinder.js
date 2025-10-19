const { SlashCommandBuilder } = require('discord.js');
const mineflayer = require('mineflayer');
const { GoalNear } = require('mineflayer-pathfinder').goals;

const { Vec3 } = require('vec3');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pathfinder')
    .setDescription('Allows the bot to move to specified coordinates.')
    .addIntegerOption((option) => option.setName('x').setDescription('The X coordinate.').setRequired(true))
    .addIntegerOption((option) => option.setName('y').setDescription('The Y coordinate.').setRequired(true))
    .addIntegerOption((option) => option.setName('z').setDescription('The Z coordinate.').setRequired(true)),
  options: {
    allowWhenBusy: false,
  },

  /**
   * @param {mineflayer.Bot} bot
   */
  async execute(interaction, bot) {
    const x = interaction.options.getInteger('x');
    const y = interaction.options.getInteger('y');
    const z = interaction.options.getInteger('z');

    await interaction.reply({
      content: `Attempting to move to X: ${x}, Y: ${y}, Z: ${z}`,
    });

    bot.config.is_busy = true;
    const target = new Vec3(x, y, z);

    try {
      bot.pathfinder.setGoal(new GoalNear(target.x, target.y, target.z, 1));

      const resetBusy = () => {
        bot.config.is_busy = false;
        bot.removeListener('goal_reached', resetBusy);
        bot.removeListener('path_update', onFail);
      };

      const onFail = (r) => {
        if (r.status === 'noPath') {
          interaction.editReply({
            content: 'No path found to target coordinates.',
          });
          resetBusy();
        }
      };

      bot.once('goal_reached', () => {
        interaction.editReply({ content: `Reached X: ${x}, Y: ${y}, Z: ${z}` });
        resetBusy();
      });

      bot.on('path_update', onFail);
    } catch (err) {
      bot.config.is_busy = false;
      console.error(err);
      await interaction.editReply({
        content: 'An error occurred while trying to pathfind.',
      });
    }
  },
};
