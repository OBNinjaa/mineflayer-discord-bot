const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bot = require("../bot");

module.exports = {
  data: new SlashCommandBuilder().setName("location").setDescription("Show the bots current location."),
  async execute(interaction) {
    const head = "https://api.mineatar.io/head/" + bot.username;

    const X = bot.entity.position.x.toFixed(1);
    const Y = bot.entity.position.y.toFixed(1);
    const Z = bot.entity.position.z.toFixed(1);

    const locationEmbed = new EmbedBuilder()
      .setColor(0xf58367)
      .setTitle(`**${bot.username}** Location`)
      .setThumbnail(head)
      .setDescription(`X: **${X}**\nY: **${Y}**\nZ: **${Z}**`)
      .setTimestamp();

    return interaction.reply({ embeds: [locationEmbed] });
  },
};
