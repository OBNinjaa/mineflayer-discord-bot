const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bot = require("../bot");

module.exports = {
  data: new SlashCommandBuilder().setName("tab").setDescription("Get the current player list tab."),
  async execute(interaction) {
    const colorCodeRegex = /§[a-f0-9klmnor]/g;

    let players = Object.keys(bot.players);
    let list = players.map((key) => bot.players[key].username.replace(colorCodeRegex, ""));
    const playerList = list.map((name) => `• ${name}`).join("\n");

    const tabEmbed = new EmbedBuilder()
      .setColor(0xf57931)
      .setTitle("Server Tab")
      .setDescription(`Here are the players currently online:\n\n${playerList}`)
      .setTimestamp();

    if (list.length > 0) {
      return interaction.reply({ embeds: [tabEmbed] });
    } else {
      return interaction.reply("There are no players online right now.");
    }
  },
};
