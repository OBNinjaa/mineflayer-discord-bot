const { SlashCommandBuilder } = require('discord.js');
const mineflayer = require('mineflayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('template')
    .setDescription('template')
    .addStringOption((option) => option.setName('template').setDescription('template').setRequired(true)),

  /**
   * @param {mineflayer.Bot} bot
   */
  async execute(interaction, bot) {
    //
  },
};
