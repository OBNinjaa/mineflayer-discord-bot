/**
 * Finds a player entity by username and returns position/distance info.
 * @param {import('mineflayer').Bot} bot
 * @param {string} targetUsername
 */
function findPlayer(bot, targetUsername) {
  let targetEntity = null;

  for (const id in bot.entities) {
    const entity = bot.entities[id];
    if (entity.username === targetUsername) {
      targetEntity = entity;
      break;
    }
  }

  if (!targetEntity) return null;

  const { x, y, z } = targetEntity.position;
  const showCoords = bot.config.show_coordinates;

  const info = {
    username: targetEntity.username,
    x: showCoords ? Math.floor(x) : 0,
    y: showCoords ? Math.floor(y) : 0,
    z: showCoords ? Math.floor(z) : 0,
    distance: showCoords ? bot.entity.position.distanceTo(targetEntity.position).toFixed(0) : 0,
  };

  return info;
}

module.exports = findPlayer;
