const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName('information').setDescription('This command returns information about the bot.'),

  async execute(interaction, bot) {
    try {
      const baseImagePath = path.join(__dirname, '../../data/base.png');
      const fontPath = path.join(__dirname, '../../data/mineglyph-faithful.ttf');

      registerFont(fontPath, { family: 'Minecraft' });

      const [baseImage, avatarImage] = await Promise.all([
        loadImage(baseImagePath),
        loadImage(`https://mineskin.eu/armor/bust/${bot.username}/100.png`),
      ]);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);

      drawOverlay(ctx, baseImage);
      drawTitle(ctx, bot.username, baseImage);
      drawAvatar(ctx, avatarImage, baseImage);
      drawBotInfo(ctx, bot, baseImage);

      const file = new AttachmentBuilder(canvas.toBuffer(), {
        name: `information.gif`,
        description: `${bot.username} information on server ${bot._client.socket._host || 'localhost / LAN'}`,
      });

      await interaction.reply({ files: [file] });
    } catch (error) {
      console.error(error);
    }
  },
};

function drawOverlay(ctx, image) {
  const squareSize = Math.floor(Math.min(image.width, image.height) * 0.95);
  const x = Math.floor((image.width - squareSize) / 2);
  const y = Math.floor((image.height - squareSize) / 2);

  ctx.fillStyle = 'rgba(26, 26, 26, 0.6)';
  ctx.fillRect(x, y, squareSize, squareSize);
}

function drawTitle(ctx, username, image) {
  const squareSize = Math.floor(Math.min(image.width, image.height) * 0.95);
  const x = Math.floor((image.width - squareSize) / 2);
  const y = Math.floor((image.height - squareSize) / 2);

  const title = `${username} Information`;
  ctx.font = '20px Minecraft';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  const textX = Math.floor((squareSize - ctx.measureText(title).width) / 2);
  const textY = y + 30;
  ctx.fillText(title, x + textX, textY);
}

function drawAvatar(ctx, avatar, image) {
  const squareSize = Math.floor(Math.min(image.width, image.height) * 0.95);
  const x = Math.floor((image.width - squareSize) / 2);
  const y = Math.floor((image.height - squareSize) / 2);

  const avatarSize = 60;
  ctx.drawImage(avatar, x + squareSize - avatarSize - 6, y + 6, avatarSize, avatarSize);
}

function drawBotInfo(ctx, bot, image) {
  const squareSize = Math.floor(Math.min(image.width, image.height) * 0.95);
  const x = Math.floor((image.width - squareSize) / 2);
  const y = Math.floor((image.height - squareSize) / 2);

  const roundedPosition = {
    x: Math.round(bot.entity.position.x),
    y: Math.round(bot.entity.position.y),
    z: Math.round(bot.entity.position.z),
  };

  const infoData = [
    `Username: ${bot.username}`,
    `UUID: ${bot.player.uuid}`,
    `Gamemode: ${bot.game.gameMode}`,
    `Health: ${bot.health}/20`,
    `Food: ${bot.food}/20`,
    `Position: ${bot.config.show_coordinates ? `${roundedPosition.x}, ${roundedPosition.y}, ${roundedPosition.z}` : 'Disabled'}`,
    `Server: ${bot._client.socket._host || 'localhost / LAN'}`,
    `Version: ${bot.version}`,
    `LevelType: ${bot.game.levelType}`,
    `Difficulty: ${bot.game.difficulty}`,
    `Dimension: ${bot.game.dimension}`,
    `Silent: ${bot.config.can_send_messages ? 'Enabled' : 'Disabled'}`,
    `Guarding: ${bot.config.guarding ? 'Enabled' : 'Disabled'}`,
    `Commands: ${bot.config.can_send_commands ? 'Enabled' : 'Disabled'}`,
    `Busy: ${bot.config.is_busy ? 'Yes' : 'No'}`,
  ];

  ctx.font = '16px Minecraft';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  const startY = y + 110;
  const lineHeight = 30;

  infoData.forEach((line, index) => {
    ctx.fillText(line, x + 10, startY + index * lineHeight);
  });
}
