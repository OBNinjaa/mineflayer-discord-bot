const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aaaaaaa")
    .setDescription("aaaaaaa.")
    .addStringOption((option) => option.setName("aaaaaaa").setDescription("aaaaaaa")),
  async execute(interaction) {
    const value = interaction.options.getString("aaaaaaa");

    const head = "https://api.mineatar.io/head/" + value;

    const exampleEmbed = new EmbedBuilder()
      .setColor(0xf57931)
      .setTitle(`Attacking: ${value}`)
      .setThumbnail(head)
      .setDescription(`the value is **${value}**`)
      .setTimestamp();

    if (value) return interaction.reply({ embeds: [exampleEmbed] });

    return interaction.reply("You did not input a aaaaaaa!");
  },
};
