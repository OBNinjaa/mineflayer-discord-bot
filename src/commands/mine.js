const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bot = require("../bot");
const collectBlock = require("mineflayer-collectblock").plugin;
const mcData = require("minecraft-data")(bot.version);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mine")
    .setDescription("Have the bot mine any mineable block in the game.")
    .addStringOption((option) => option.setName("block").setDescription("The block to mine e.g diamond_ore")),
  async execute(interaction) {
    try {
      const value = interaction.options.getString("block");

      if (!value) return interaction.reply("You did not input a block name!");

      const head = "https://api.mineatar.io/head/" + value;

      const mineEmbed = new EmbedBuilder()
        .setColor(0xf58367)
        .setTitle(`Mining: ${value}`)
        .setThumbnail(head)
        .setDescription(`**${bot.username}** is now mining: ${value}`)
        .setTimestamp();

      await interaction.reply({ embeds: [mineEmbed] });

      bot.loadPlugin(require("mineflayer-collectblock").plugin);

      const blockType = mcData.blocksByName[value];

      if (!blockType) {
        console.log(`I don't know any blocks named ${value}.`);
        return;
      }

      const block = bot.findBlock({
        matching: blockType.id,
        maxDistance: 64,
      });

      if (!block) {
        console.log(`Cannot find ${value} nearby.`);
        return;
      }

      console.log(block);

      bot.collectBlock.collect(block, (err) => {
        if (err) {
          console.log(`Error while mining ${value}: ${err}`);
          return interaction.followUp(`Error while mining ${value}: ${err}`);
        }

        console.log(`Successfully mined ${value}.`);
        interaction.followUp(`Successfully mined ${value}.`);
      });
    } catch (error) {
      console.error(error);
      interaction.followUp("There was an error while executing this command!");
    }
  },
};
