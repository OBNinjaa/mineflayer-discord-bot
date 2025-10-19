const { SlashCommandBuilder } = require('discord.js');
const findPlayer = require('../../utils/findPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('near')
    .setDescription('Get the position of nearby players.')
    .addStringOption((option) => option.setName('player').setDescription('The player to locate').setRequired(true)),

  async execute(interaction, bot) {
    const target = interaction.options.getString('player');
    const info = findPlayer(bot, target);

    if (info) {
      bot.config.is_busy = false;
      return interaction.reply({
        content: `${info.username} located at (${info.x}, ${info.y}, ${info.z}). They are ${info.distance} blocks away.`,
      });
    } else {
      return interaction.reply({
        content: `${target} is not in my view distance.`,
      });
    }
  },
};
