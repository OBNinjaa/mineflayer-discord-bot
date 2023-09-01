const { SlashCommandBuilder } = require("discord.js");
const { Embed } = require("../../classes/Embed");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("information").setDescription("Get basic information about the bot."),
  async execute(interaction, bot) {
    const roundedPosition = {
      x: Math.round(bot.entity.position.x),
      y: Math.round(bot.entity.position.y),
      z: Math.round(bot.entity.position.z),
    };

    const informationEmbed = new Embed(bot)
      .setTitle(`${bot.username}'s Information`)
      .addFields(
        { name: "Player UUID", value: `\`${bot.player.uuid}\``, inline: false },
        { name: "Position", value: `\`${roundedPosition.x}, ${roundedPosition.y}, ${roundedPosition.z}\``, inline: false },
        { name: "Username", value: `\`${bot.username}\``, inline: false },
        { name: "Health", value: `\`${bot.health}/20\``, inline: false },
        { name: "Food", value: `\`${bot.food}/20\``, inline: false },
        { name: "GameMode", value: `\`${bot.game.gameMode}\``, inline: false },
        { name: "Difficulty", value: `\`${bot.game.difficulty}\``, inline: false },
        { name: "Server", value: `\`${bot._client.socket._host}\``, inline: false },
        { name: "Version", value: `\`${bot.version}\``, inline: false },
        { name: "levelType", value: `\`${bot.game.levelType}\``, inline: false },
        { name: "dimension", value: `\`${bot.game.dimension}\``, inline: false }
      );

    await interaction.reply({ embeds: [informationEmbed] });
  },
};
