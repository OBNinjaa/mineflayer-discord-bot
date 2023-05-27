const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bot = require("../bot");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const pvp = require("mineflayer-pvp").plugin;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("attack")
    .setDescription("Have the bot attack any player that is within range of the bot.")
    .addStringOption((option) => option.setName("username").setDescription("The username of the player you want to have the bot attack")),
  async execute(interaction) {
    const value = interaction.options.getString("username");

    if (!value) return interaction.reply("You did not input a username!");

    const head = "https://api.mineatar.io/head/" + value;

    bot.loadPlugin(pathfinder);
    bot.loadPlugin(pvp);

    const player = bot.players[value];

    const cantFind = new EmbedBuilder()
      .setColor(0xf58367)
      .setTitle(`Can't Find: ${value}`)
      .setThumbnail(head)
      .setDescription(`I am unable to find **${value}**\nMake sure they are near the bot`)
      .setTimestamp();

    if (!player) {
      bot.pvp.stop();
      return interaction.reply({ embeds: [cantFind] });
    } else {
      const attackEmbed = new EmbedBuilder()
        .setColor(0xf58367)
        .setTitle(`Attacking: ${value}`)
        .setThumbnail(head)
        .setDescription(`You will be notified once the bot has finished attacking **${value}**`)
        .setTimestamp();

      const reply = await interaction.reply({ embeds: [attackEmbed] });

      bot.once("stoppedAttacking", () => {
        const deathEmbed = new EmbedBuilder()
          .setColor("#67f570")
          .setTitle("Bot Attack Finished")
          .setThumbnail(head)
          .setDescription(`The bot has finished attacking **${value}**`)
          .setTimestamp();

        interaction.editReply({ embeds: [deathEmbed] });
      });

      bot.pvp.attack(player.entity);
    }
  },
};
