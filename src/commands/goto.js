const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bot = require("../bot");

const { pathfinder, Movements } = require("mineflayer-pathfinder");
const { GoalBlock } = require("mineflayer-pathfinder").goals;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("goto")
    .setDescription("Have the bot move to any position in the world.")
    .addStringOption((option) => option.setName("xpos").setDescription("The X position"))
    .addStringOption((option) => option.setName("ypos").setDescription("The Y position"))
    .addStringOption((option) => option.setName("zpos").setDescription("The Z position")),

  async execute(interaction) {
    bot.loadPlugin(pathfinder);

    const head = "https://api.mineatar.io/head/" + bot.username;

    const x = interaction.options.getString("xpos");
    const y = interaction.options.getString("ypos");
    const z = interaction.options.getString("zpos");

    const pathfindStart = new EmbedBuilder()
      .setColor(0xf58367)
      .setTitle("Pathfinding initialized")
      .setThumbnail(head)
      .setDescription(`You will be notified once **${bot.username}**\n has finished pathfinding`)
      .setTimestamp();

    const reply = await interaction.reply({ embeds: [pathfindStart] });

    // bot.chat(`${x} ${y} ${z}`);

    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);
    defaultMove.canDig = true;
    defaultMove.allowFreeMotion = true;
    defaultMove.scafoldingBlocks.push(mcData.itemsByName["dirt"].id);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalBlock(x, y, z));

    bot.on("path_update", function (e) {
      if (e.status === "noPath") {
        bot.pathfinder.stop();
        const noPath = new EmbedBuilder()
          .setColor(0xf5c367)
          .setTitle("Pathfinding stopped")
          .setThumbnail(head)
          .setDescription(
            `**${bot.username}** is currently stuck and can't reach it's path, This could be because the location is in the void which the bot can't reach or the bot is trying to scaffold which it can't do because it has no blocks.`
          )
          .setTimestamp();

        return interaction.editReply({ embeds: [noPath] });
      }
    });

    bot.on("goal_reached", () => {
      const pathComplete = new EmbedBuilder()
        .setColor(0x67f570)
        .setTitle("Finished pathfinding")
        .setThumbnail(head)
        .setDescription(`**${bot.username}** has finished pathfinding\nLocation: **${x} ${y} ${z}**`)
        .setTimestamp();

      interaction.editReply({ embeds: [pathComplete] });
    });
  },
};
