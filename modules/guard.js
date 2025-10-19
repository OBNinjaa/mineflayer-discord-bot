const mineflayer = require('mineflayer');
const { Vec3 } = require('vec3');
const { Movements } = require('mineflayer-pathfinder');

/**
 * @param {mineflayer.Bot} bot
 */
module.exports = function (bot) {
  let guardedArea = null;
  const guardedEntities = new Set();
  let isFighting = false;

  const moves = new Movements(bot);
  moves.allowFreeMotion = true;
  moves.allowParkour = true;
  moves.allowSprinting = true;
  bot.pathfinder.setMovements(moves);

  function startGuarding(position, size) {
    stopGuarding();

    const botPos = position.floored();
    guardedArea = {
      min: new Vec3(botPos.x - size, botPos.y - size, botPos.z - size),
      max: new Vec3(botPos.x + size, botPos.y + size, botPos.z + size),
    };
    bot.config.guarding = true;
    guardedEntities.clear();
    bot.on('physicTick', guard);
  }

  function stopGuarding() {
    if (bot.config.guarding) {
      bot.removeListener('physicTick', guard);
    }
    bot.config.guarding = false;
    guardedArea = null;
    isFighting = false;
    bot.swordpvp.stop();
    guardedEntities.clear();
    bot.chat('No longer guarding.');
  }

  function stopGuarding() {
    bot.config.guarding = false;
    guardedArea = null;
    isFighting = false;
    bot.removeListener('physicTick', guard);

    bot.swordpvp.stop();
    if (bot.pathfinder.isMoving()) bot.pathfinder.stop();

    guardedEntities.clear();
    bot.chat('No longer guarding.');
  }

  async function equipShield() {
    const shield = bot.inventory.items().find((item) => item.name.includes('shield'));
    if (shield) {
      try {
        await bot.equip(shield, 'off-hand');
      } catch (err) {
        //
      }
    }
  }

  const fight = (targetEntity) => {
    if (targetEntity && !isFighting) {
      isFighting = true;
      equipShield();
      bot.swordpvp.attack(targetEntity);

      bot.swordpvp.once('stoppedAttacking', () => {
        isFighting = false;
      });
    }
  };

  function guard() {
    if (!bot.config.guarding || !guardedArea || isFighting) return;

    let closestEntity = null;
    let closestDistance = Infinity;

    for (const entity of Object.values(bot.entities)) {
      if (entity === bot.entity) continue;
      if (entity.type === 'player' || entity.kind === 'Hostile mobs') {
        const pos = entity.position;
        if (
          pos.x >= guardedArea.min.x &&
          pos.x <= guardedArea.max.x &&
          pos.y >= guardedArea.min.y &&
          pos.y <= guardedArea.max.y &&
          pos.z >= guardedArea.min.z &&
          pos.z <= guardedArea.max.z
        ) {
          if (!guardedEntities.has(entity.uuid)) {
            const distance = bot.entity.position.distanceTo(entity.position);
            if (distance < closestDistance) {
              closestEntity = entity;
              closestDistance = distance;
            }
          }
        }
      }
    }

    if (closestEntity) {
      const entityName = closestEntity.type === 'player' ? closestEntity.username : closestEntity.displayName;
      bot.lookAt(closestEntity.position.offset(0, closestEntity.height, 0));
      guardedEntities.add(closestEntity.uuid);

      bot.swordpvp.options.cps = 20;
      bot.swordpvp.options.critConfig.reaction.enabled = false;
      bot.swordpvp.options.rotateConfig.smooth = true;

      fight(closestEntity);
    }

    for (const uuid of guardedEntities) {
      const entity = bot.entities[uuid];
      if (!entity) {
        guardedEntities.delete(uuid);
        continue;
      }
      const pos = entity.position;
      if (
        pos.x < guardedArea.min.x ||
        pos.x > guardedArea.max.x ||
        pos.y < guardedArea.min.y ||
        pos.y > guardedArea.max.y ||
        pos.z < guardedArea.min.z ||
        pos.z > guardedArea.max.z
      ) {
        guardedEntities.delete(uuid);
      }
    }
  }

  return {
    name: 'guard',
    busy: true,
    cooldown: 10,
    manager: true,
    /**
     * @param {mineflayer.Bot} bot
     * @param {string} sender
     * @param {string[]} args
     */
    execute(bot, sender, args) {
      const subCommand = args[0];

      if (subCommand === 'on') {
        if (bot.config.guarding) {
          bot.chat('I am already guarding. Use "guard off" to stop and restart.');
          return;
        }
        const size = args[1] ? parseInt(args[1], 10) : 10;
        if (isNaN(size)) {
          bot.chat('Please specify a valid size for "guard on [size]".');
          return;
        }
        startGuarding(bot.entity.position, size);
        bot.chat(`Started guarding an area of size ${size}.`);
      } else if (subCommand === 'off') {
        if (bot.config.guarding) {
          stopGuarding();
        } else {
          bot.chat('I am not currently guarding.');
        }
      } else {
        bot.chat('Invalid syntax. Use "guard on [size]" or "guard off".');
      }
    },
  };
};
