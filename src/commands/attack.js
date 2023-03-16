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
      .setTitle(`Cant Find: ${value}`)
      .setThumbnail(head)
      .setDescription(`I am unable to find **${value}**\nMake sure they are near the bot`)
      .setTimestamp();

    if (!player) {
      bot.pvp.forceStop();
      return interaction.reply({ embeds: [cantFind] });
    } else {
      const attackEmbed = new EmbedBuilder()
        .setColor(0xf58367)
        .setTitle(`Attacking: ${value}`)
        .setThumbnail(head)
        .setDescription(`You will be notified once the bot\n has finished attacking **${value}**`)
        .setTimestamp();

      const reply = await interaction.reply({ embeds: [attackEmbed] });

      bot.once("message", (jsonMsg, position) => {
        if (position !== "system") return;

        const message = jsonMsg.toString();
        const deathMatch = /(.+) was slain by (.+)/.exec(message);

        if (deathMatch) {
          const victim = deathMatch[1];
          const attacker = deathMatch[2];

          console.log(`Victim: ${victim}`);
          console.log(`Attacker: ${attacker}`);

          const isBotVictim = victim === bot.username;

          const deathEmbed = new EmbedBuilder()
            .setColor(isBotVictim ? "#f56767" : "#67f570")
            .setTitle(isBotVictim ? "You lost" : "You won")
            .setThumbnail(head)
            .setDescription(`**${victim}** was slain by **${attacker}**`)
            .setTimestamp();

          interaction.editReply({ embeds: [deathEmbed] });
        }
      });
    }

    bot.pvp.attack(player.entity);
  },
};
