const mineflayer = require("mineflayer");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.once("spawn", async () => {
    const block = bot.findBlock({
      matching: (block) => block.name === "enchanting_table",
      maxDistance: 64,
    });

    if (block) {
      let table = await bot.openEnchantmentTable(block);
      await table.putLapis(table.findInventoryItem("lapis_lazuli"));
      await table.putTargetItem(table.findInventoryItem("diamond_sword"));
      table.once("ready", async () => {
        table.enchant(2);
      });
    } else {
      bot.chat("Could not find an enchanting table.");
    }
  });
};
