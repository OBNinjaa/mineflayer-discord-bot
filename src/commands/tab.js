const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bot = require("../bot");

module.exports = {
  data: new SlashCommandBuilder().setName("tab").setDescription("Get the current player list tab."),
  async execute(interaction) {
    let players = Object.keys(bot.players);
    let list = players.map((e) => e.username);
    const playerList = players.join(", ");

    const tabEmbed = new EmbedBuilder()
      .setColor(0xf57931)
      .setTitle(`Server Tab`)
      .setDescription(`Here are the players currently online:\n\n${playerList}`)
      .setTimestamp();

    if (playerList) {
      return interaction.reply({ embeds: [tabEmbed] });
    } else {
      return interaction.reply("There are no players online right now.");
    }
  },
};
