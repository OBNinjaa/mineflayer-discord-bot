const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("players").setDescription("Get a list of players currently online."),
  async execute(interaction, bot) {
    const players = Object.values(bot.players).map((player) => player.username);

    const playersEmbed = new EmbedBuilder()
      .setTitle("Player List")
      .addFields({ name: "Players:", value: players.map((player) => `\`${player}\``).join(", "), inline: false })
      .setColor("#995e2a")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    await interaction.reply({ embeds: [playersEmbed] });
  },
};
