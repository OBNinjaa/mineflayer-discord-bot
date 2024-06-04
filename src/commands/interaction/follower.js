const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Movements } = require("mineflayer-pathfinder");
const { GoalNear } = require("mineflayer-pathfinder").goals;

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("follow").setDescription("This command returns a list of all nearby players that the bot can follow."),
  async execute(interaction, bot) {
    const nearbyPlayers = Object.keys(bot.players).filter((player) => player !== bot.username);

    const selectMenuOptions = nearbyPlayers.slice(0, 25).map((player) => ({
      label: player,
      value: player,
    }));

    const selectMenu = new StringSelectMenuBuilder().setCustomId("player_select").setPlaceholder("Select a player").addOptions(selectMenuOptions);

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      content: "Choose a player to follow:",
      components: [actionRow],
    });

    const filter = (interaction) => interaction.isStringSelectMenu() && interaction.customId === "player_select";
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on("collect", async (interaction) => {
      const selectedPlayer = interaction.values[0];
      const player = bot.players[selectedPlayer];

      if (player) {
        console.log(`\x1b[38;5;208m${"\x1b[33m" + `Following:` + "\x1b[0m"} \x1b[32m${selectedPlayer}\x1b[0m`);
        await interaction.reply(`Moving towards **${selectedPlayer}** location`);

        const movements = new Movements(bot, bot.entity);

        movements.allow1by1towers = true;
        movements.allowParkour = true;
        movements.canDigLadders = true;
        movements.canOpenDoors = true;
        movements.canDig = true;

        bot.pathfinder.setMovements(movements);
        bot.pathfinder.setGoal(new GoalNear(player.entity.position.x, player.entity.position.y, player.entity.position.z, 0));

        bot.once("goal_reached", () => {
          console.log(`\x1b[38;5;208m${"\x1b[33m" + `Stopped following:` + "\x1b[0m"} \x1b[32m${selectedPlayer}\x1b[0m`);
          if (!bot.config.silent) {
            bot.chat(`I have arrived!`);
          }
          interaction.followUp({ content: `Stopped following **${selectedPlayer}**` });
        });
      } else {
        await interaction.reply(`The player you selected, **${selectedPlayer}**, is not online or not found. Please try again with a different player.`);
      }
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
