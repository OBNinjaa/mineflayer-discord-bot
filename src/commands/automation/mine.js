const mineflayer = require("mineflayer");
const { SlashCommandBuilder } = require("discord.js");
const { Embed } = require("../../classes/Embed");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("mine")
    .setDescription("Have the bot mine blocks.")
    .addStringOption((option) => option.setName("block").setDescription("Enter the block you would like to mine.").setRequired(true))
    .addNumberOption((option) => option.setName("count").setDescription("How many blocks to mine.").setRequired(true)),
  async execute(interaction, bot) {
    const value = interaction.options.getString("block");
    const count = interaction.options.getNumber("count");

    const blockType = bot.registry.blocksByName[value];
    if (!blockType) {
      return;
    }

    const blocks = bot.findBlocks({
      matching: blockType.id,
      maxDistance: 64,
      count: count,
    });

    if (blocks.length === 0) {
      const error = new Embed(bot).setTitle("There Is A Problem").setDescription(`Sorry, I could not find any blocks matching **\`${value}\`**. Try moving the bot to a new location before trying to mine that block again.`);
      return interaction.reply({ embeds: [error] });
    }

    const targets = [];
    for (let i = 0; i < Math.min(blocks.length, count); i++) {
      targets.push(bot.blockAt(blocks[i]));
    }

    const initialize = new Embed(bot).setTitle("Mining Has Initialized").setDescription(`I have found **${targets.length} ${value}(s)**. You will be notified when I have finished collecting all of the blocks.`);
    await interaction.reply({ embeds: [initialize] });

    try {
      await bot.collectBlock.collect(targets);
      const success = new Embed(bot).setTitle("Mining Has Stopped").setDescription(`Successfully mined **${count} ${value}(s)**. You can use deposit to deposit the mined blocks.`);
      await interaction.followUp({ embeds: [success] });
    } catch (err) {
      interaction.followUp(err.message);
    }
  },
};
