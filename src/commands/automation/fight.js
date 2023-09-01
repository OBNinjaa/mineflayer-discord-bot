const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Embed } = require("../../classes/Embed");

const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const pvp = require("mineflayer-pvp").plugin;

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("fight")
    .setDescription("Have the bot fight any player in it's view.")
    .addStringOption((option) => option.setName("username").setDescription("The username of the player to fight.").setRequired(true)),

  async execute(interaction, bot) {
    const username = interaction.options.getString("username");
    const player = bot.players[username];

    if (!player) {
      const embed = new Embed(bot).setTitle("There Is A Problem").setDescription(`Sorry, I could not find any players matching **\`${username}\`**.`);
      return interaction.reply({ embeds: [embed] });
    }

    const embed = new Embed(bot).setTitle("Fighting Player").setDescription(`Now fighting player: ${username}`);
    await interaction.reply({ embeds: [embed] });

    bot.once("stoppedAttacking", () => {
      const embed = new Embed(bot).setTitle("Fighting Stopped").setDescription(`The bot has stopped attacking: ${username}`);
      interaction.followUp({ embeds: [embed] });
    });

    bot.pvp.attack(player.entity);
  },
};
