const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bot = require("../bot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mine")
    .setDescription("Have the bot mine any mineable block in the game.")
    .addStringOption((option) => option.setName("block").setDescription("The block to mine e.g diamond_ore")),
  async execute(interaction) {
    const value = interaction.options.getString("block");

    const head = "https://api.mineatar.io/head/" + value;

    const mineEmbed = new EmbedBuilder()
      .setColor(0xf58367)
      .setTitle(`Mining: ${value}`)
      .setThumbnail(head)
      .setDescription(`**${bot.username}** is now mining: ${value}`)
      .setTimestamp();

    if (value) return interaction.reply({ embeds: [mineEmbed] });

    return interaction.reply("You did not input a block name!");
  },
};
