const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Embed } = require("../../classes/Embed");

const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const pvp = require("mineflayer-pvp").plugin;

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("fight").setDescription("Fight a player that is in range."),
  async execute(interaction, bot) {
    const nearbyPlayers = Object.keys(bot.players).filter((player) => player !== bot.username);

    const selectMenuOptions = nearbyPlayers.slice(0, 25).map((player) => ({
      label: player,
      value: player,
    }));

    const selectMenu = new StringSelectMenuBuilder().setCustomId("player_select").setPlaceholder("Select a player").addOptions(selectMenuOptions);

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      content: "Choose a player you would like to fight.",
      components: [actionRow],
    });

    const filter = (interaction) => interaction.isStringSelectMenu() && interaction.customId === "player_select";
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on("collect", async (interaction) => {
      const selectedPlayer = interaction.values[0];
      const player = bot.players[selectedPlayer];

      if (player) {
        console.log(`\x1b[38;5;208m${"\x1b[33m" + `Fighting:` + "\x1b[0m"} \x1b[32m${selectedPlayer}\x1b[0m`);
        await interaction.reply(`${bot.username} is now fighting **${selectedPlayer}**`);
        bot.pvp.attack(player.entity);
      }

      bot.once("stoppedAttacking", () => {
        interaction.followUp({ content: `${bot.username} has stopped fighting **${selectedPlayer}**` });
      });
    });

    collector.on("end", () => {
      if (interaction.message && interaction.message.components) {
        interaction.message.components.forEach((component) => {
          component.components.forEach((comp) => comp.setDisabled(true));
        });
        interaction.message.edit({ components: interaction.message.components });
      }
    });
  },
};
