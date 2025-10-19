const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont, loadImage } = require('canvas');
const fetch = require('node-fetch');

const fontPath = path.join(__dirname, '../../data/mineglyph-faithful.ttf');
registerFont(fontPath, { family: 'Minecraft' });

const baseFontSize = 12;
const minFontSize = 8;
const fontFamily = 'Minecraft';
const rectHeight = 18;
const dividerColor = '#2f3133';
const backgroundColor = '#2f3133';

const pingPaddingRight = 2;
const headImageWidth = 18;
const maxPingHeight = rectHeight - 2;

const maxRowsPerCol = 20;

module.exports = {
  data: new SlashCommandBuilder().setName('playerlist').setDescription('See a list of players on the server.'),

  async execute(interaction, bot) {
    await interaction.deferReply();

    const playersRaw = Object.keys(bot.players).filter((name) => !!name);

    function isDumbName(name) {
      const cleaned = name.replace(/§./g, '').trim();
      if (cleaned.length === 0) return true;
      const alnumCount = (cleaned.match(/[a-zA-Z0-9]/g) || []).length;
      const ratio = alnumCount / cleaned.length;
      if (ratio < 0.4) return true;
      if (/[\x00-\x1F]/.test(name)) return true;
      return false;
    }

    const players = playersRaw.map((name) => (isDumbName(name) ? 'Invalid' : name));

    if (players.length === 0) {
      return interaction.editReply('No players online.');
    }

    const pingImagePath = path.join(__dirname, '../../data/ping.png');
    const pingImg = await loadImage(pingImagePath);

    const pingScale = (maxPingHeight / pingImg.height) * 0.8;
    const pingWidth = Math.round(pingImg.width * pingScale);
    const pingHeight = Math.round(pingImg.height * pingScale);

    const headImages = await Promise.all(
      players.map(async (player) => {
        if (player.startsWith('.')) {
          player = 'Notch';
        }
        const url = `https://mineskin.eu/avatar/${encodeURIComponent(player)}/100.png`;
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed to fetch head image');
          const buffer = await response.buffer();
          return await loadImage(buffer);
        } catch {
          const fallbackCanvas = createCanvas(16, 16);
          return fallbackCanvas;
        }
      }),
    );

    const tempCanvas = createCanvas(1, 1);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `${baseFontSize}px ${fontFamily}`;
    const maxNameWidthAtBase = Math.max(...players.map((name) => tempCtx.measureText(name).width));

    const numCols = Math.ceil(players.length / maxRowsPerCol);
    const numRows = Math.min(players.length, maxRowsPerCol);

    const colWidth = maxNameWidthAtBase + headImageWidth + pingWidth + pingPaddingRight;

    const canvasWidth = numCols * colWidth;
    const canvasHeight = numRows * rectHeight - (numRows - 1);

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < players.length; i++) {
      const col = Math.floor(i / maxRowsPerCol);
      const row = i % maxRowsPerCol;

      const xOffset = col * colWidth;
      const y = row * (rectHeight - 1);

      ctx.fillStyle = backgroundColor;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(xOffset, y, colWidth, rectHeight);
      ctx.globalAlpha = 1;

      ctx.strokeStyle = dividerColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xOffset, y + 0.5);
      ctx.lineTo(xOffset + colWidth, y + 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(xOffset + 0.5, y);
      ctx.lineTo(xOffset + 0.5, y + rectHeight);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xOffset + colWidth - 0.5, y);
      ctx.lineTo(xOffset + colWidth - 0.5, y + rectHeight);
      ctx.stroke();

      if (row === numRows - 1 || i === players.length - 1) {
        ctx.beginPath();
        ctx.moveTo(xOffset, y + rectHeight - 0.5);
        ctx.lineTo(xOffset + colWidth, y + rectHeight - 0.5);
        ctx.stroke();
      }

      ctx.drawImage(headImages[i], xOffset + 1, y + 1, 16, 16);

      const maxNameWidth = colWidth - headImageWidth - pingWidth - pingPaddingRight - 4;
      let fontSize = baseFontSize;
      tempCtx.font = `${fontSize}px ${fontFamily}`;
      let textWidth = tempCtx.measureText(players[i]).width;
      while (textWidth > maxNameWidth && fontSize > minFontSize) {
        fontSize -= 0.5;
        tempCtx.font = `${fontSize}px ${fontFamily}`;
        textWidth = tempCtx.measureText(players[i]).width;
      }

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = '#fff';
      const textBaselineY = y + 1 + 8 + fontSize / 2.5;
      ctx.fillText(players[i], xOffset + headImageWidth + 1, textBaselineY);

      const pingX = xOffset + colWidth - pingWidth - pingPaddingRight;
      const pingY = y + rectHeight - pingHeight - 1;
      ctx.drawImage(pingImg, pingX, pingY, pingWidth, pingHeight);
    }

    const buffer = canvas.toBuffer('image/png');

    const cleanDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const attachment = new AttachmentBuilder(buffer, {
      name: 'playerlist.png',
      description: `Player list on server ${bot._client.socket._host || 'localhost / LAN'} Date: ${cleanDate}`,
    });

    await interaction.editReply({ files: [attachment] });
  },
};
