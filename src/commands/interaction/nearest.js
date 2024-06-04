const { SlashCommandBuilder } = require("discord.js");
const { Embed } = require("../../classes/Embed");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("nearest").setDescription("This command returns the nearest player to the bot."),
  async execute(interaction, bot) {
    const nearby = bot.nearestEntity((entity) => entity.type === "player");

    if (nearby) {
      const { x, y, z } = nearby.position;

      const embed = new Embed(bot, nearby.username).setTitle("Nearest player").addFields([
        {
          name: "Username",
          value: nearby.username,
        },
        {
          name: "Position",
          value: `${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}`,
        },
      ]);
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply("No nearby players.");
    }
  },
};
