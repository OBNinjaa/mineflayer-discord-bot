const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bot = require("../bot");

module.exports = {
  data: new SlashCommandBuilder().setName("status").setDescription("Show information about the bot."),
  async execute(interaction) {
    const head = "https://api.mineatar.io/head/" + bot.username;

    const X = bot.entity.position.x.toFixed(1);
    const Y = bot.entity.position.y.toFixed(1);
    const Z = bot.entity.position.z.toFixed(1);

    const statusEmbed = new EmbedBuilder()
      .setColor(0xf58367)
      .setTitle(`**${bot.username}** Statistics`)
      .setThumbnail(head)
      .setDescription(`Health: **${bot.health}**\nFood: **${bot.food}**\nXP: **${bot.experience.level || 0}**`)
      .setTimestamp();

    return interaction.reply({ embeds: [statusEmbed] });
  },
};
