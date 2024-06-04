const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("information").setDescription("This command returns information about the bot."),
  async execute(interaction, bot) {
    const base_image = path.join(__dirname, "../../data/images/base.png");
    const font = path.join(__dirname, "../../data/fonts/iJ52hQH.ttf");

    registerFont(font, { family: "Minecraft" });

    Promise.all([loadImage(base_image), loadImage(`https://mineskin.eu/armor/bust/${bot.username}/100.png`)])
      .then(async ([image, avatar]) => {
        const squareSize = Math.floor(Math.min(image.width, image.height) * 0.95);
        const x = Math.floor((image.width - squareSize) / 2);
        const y = Math.floor((image.height - squareSize) / 2);

        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0, image.width, image.height);

        ctx.fillStyle = "rgba(26, 26, 26, 0.6)";
        ctx.fillRect(x, y, squareSize, squareSize);

        const title = `${bot.username} Information`;
        ctx.font = "20px Minecraft";
        const textX = Math.floor((squareSize - ctx.measureText(title).width) / 2);
        const textY = y + 30;

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillText(title, x + textX, textY);

        const avatarSize = 60;
        ctx.drawImage(avatar, x + squareSize - avatarSize - 6, y + 6, avatarSize, avatarSize);

        const roundedPosition = {
          x: Math.round(bot.entity.position.x),
          y: Math.round(bot.entity.position.y),
          z: Math.round(bot.entity.position.z),
        };

        const sY = textY + 80;
        const rH = 30;
        const data = [
          `Username: ${bot.username}`,
          `UUID: ${bot.player.uuid}`,
          `Gamemode: ${bot.game.gameMode}`,
          `Health: ${bot.health}/20`,
          `Food: ${bot.food}/20`,
          `Position: ${bot.config.showCoordinates ? `${roundedPosition.x}, ${roundedPosition.y}, ${roundedPosition.z}` : "Disabled"}`,
          `Server: ${bot._client.socket._host ? bot._client.socket._host : "localhost / LAN"}`,
          `Version: ${bot.version}`,
          `LevelType: ${bot.game.levelType}`,
          `Difficulty: ${bot.game.difficulty}`,
          `Dimension: ${bot.game.dimension}`,
          `Guard Status: ${bot.config.guarding ? "True" : "False"}`,
          `Silent Mode: ${bot.config.silent ? "True" : "False"}`,
          `Logging: ${bot.config.logging ? "True" : "False"}`,
        ];
        ctx.font = "16px Minecraft";
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        for (let i = 0; i < data.length; i++) {
          ctx.fillText(data[i], x + 10, sY + i * rH);
        }

        const file = new AttachmentBuilder(canvas.toBuffer(), {
          name: `information.gif`,
          description: "Information about the bot and the server it is currently on.",
        });

        await interaction.reply({ files: [file] });
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
