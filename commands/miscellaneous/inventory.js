const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const mineflayer = require('mineflayer');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
  data: new SlashCommandBuilder().setName('inventory').setDescription('Get the inventory of the bot.'),

  /**
   * @param {mineflayer.Bot} bot
   */
  async execute(interaction, bot) {
    const mcAssets = require('minecraft-assets')(bot.version);
    const baseImagePath = path.join(__dirname, '../../data/inventory.png');
    const fontPath = path.join(__dirname, '../../data/mineglyph-faithful.ttf');

    const slots = {
      36: { x: 16, y: 284 },
      37: { x: 52, y: 284 },
      38: { x: 88, y: 284 },
      39: { x: 124, y: 284 },
      40: { x: 160, y: 284 },
      41: { x: 196, y: 284 },
      42: { x: 232, y: 284 },
      43: { x: 268, y: 284 },
      44: { x: 304, y: 284 },
      9: { x: 16, y: 168 },
      10: { x: 52, y: 168 },
      11: { x: 88, y: 168 },
      12: { x: 124, y: 168 },
      13: { x: 160, y: 168 },
      14: { x: 196, y: 168 },
      15: { x: 232, y: 168 },
      16: { x: 268, y: 168 },
      17: { x: 304, y: 168 },
      18: { x: 16, y: 204 },
      19: { x: 52, y: 204 },
      20: { x: 88, y: 204 },
      21: { x: 124, y: 204 },
      22: { x: 160, y: 204 },
      23: { x: 196, y: 204 },
      24: { x: 232, y: 204 },
      25: { x: 268, y: 204 },
      26: { x: 304, y: 204 },
      27: { x: 16, y: 240 },
      28: { x: 52, y: 240 },
      29: { x: 88, y: 240 },
      30: { x: 124, y: 240 },
      31: { x: 160, y: 240 },
      32: { x: 196, y: 240 },
      33: { x: 232, y: 240 },
      34: { x: 268, y: 240 },
      35: { x: 304, y: 240 },
    };

    try {
      registerFont(fontPath, { family: 'Minecraft' });

      const image = await loadImage(baseImagePath);
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, 0, 0, image.width, image.height);

      ctx.font = '13px Minecraft';
      ctx.fillStyle = '#FCFCFC';
      ctx.strokeStyle = '#3E3E3E';
      ctx.lineWidth = 2;

      for (const item of bot.inventory.items()) {
        const slotInfo = slots[item.slot];
        if (slotInfo) {
          const texture = mcAssets.textureContent[item.name];
          if (texture && texture.texture) {
            const base64Data = texture.texture.replace(/^data:image\/png;base64,/, '');
            const imgBuffer = Buffer.from(base64Data, 'base64');

            const itemImage = await loadImage(imgBuffer);
            ctx.drawImage(itemImage, slotInfo.x, slotInfo.y, 32, 32);

            if (item.count > 1) {
              ctx.textAlign = 'right';
              ctx.textBaseline = 'bottom';
              ctx.strokeText(item.count.toString(), slotInfo.x + 35, slotInfo.y + 31);
              ctx.fillText(item.count.toString(), slotInfo.x + 34, slotInfo.y + 30);
            }
          }
        }
      }

      const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'inventory.png' });
      await interaction.reply({ files: [attachment] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error creating the inventory image.', ephemeral: true });
    }
  },
};
