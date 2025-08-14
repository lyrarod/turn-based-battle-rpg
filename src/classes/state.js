export const enemies = [
  {
    music: "battle-against-machine.mp3",
    background: "bg/battle_bg_0005_01.jpg",
    name: "Lava Golem",
    hp: 300,
    maxhp: 300,
    damage: 15,
    maxDamage: 25,
    icon: "lava-golem-icon.png",
    animations: {
      idle: {
        sprite: "lava-golem-idle.png",
        width: 1008 / 4,
        height: 304 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "lava-golem-atk-hit.png",
        width: 1008 / 4,
        height: 152,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "lava-golem-atk-hit.png",
        width: 1010 / 4,
        height: 150,
        framex: [3],
        framey: 1,
      },
    },
  },
  {
    music: "battle-against-machine.mp3",
    background: "bg/battle_bg_0005_01.jpg",
    name: "Demon",
    hp: 300,
    maxhp: 300,
    damage: 15,
    maxDamage: 25,
    icon: "demon-icon.png",
    animations: {
      idle: {
        sprite: "demon-idle.png",
        width: 1010 / 4,
        height: 300 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "demon-attack-hit.png",
        width: 1010 / 4,
        height: 150,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "demon-attack-hit.png",
        width: 1010 / 4,
        height: 150,
        framex: [3],
        framey: 1,
      },
    },
  },
  {
    music: "battle-against-machine.mp3",
    background: "bg/battle_bg_0005_01.jpg",
    name: "Frost Dragon",
    hp: 300,
    maxhp: 300,
    damage: 15,
    maxDamage: 25,
    icon: "frost-dragon-icon.png",
    animations: {
      idle: {
        sprite: "frost-dragon-idle.png",
        width: 1008 / 4,
        height: 304 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "frost-dragon-atk-hit.png",
        width: 756 / 3,
        height: 150 / 1,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "frost-dragon-atk-hit.png",
        width: 252,
        height: 152,
        framex: [3],
        framey: 1,
      },
    },
  },
  {
    music: "dark_world.ogg",
    background: "bg/battle_bg_0002_03.jpg",
    name: "Diamond Golem",
    hp: 500,
    maxhp: 500,
    damage: 15,
    maxDamage: 30,
    icon: "diamond-golem-icon.png",
    animations: {
      idle: {
        sprite: "diamond-golem-idle.png",
        width: 1008 / 4,
        height: 304 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "diamond-golem-attack-hit.png",
        width: 1008 / 4,
        height: 152,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "diamond-golem-attack-hit.png",
        width: 1008 / 4,
        height: 152,
        framex: [3],
        framey: 1,
      },
    },
  },
];

export const allEnemies = () => {
  return enemies.map((enemy) => {
    return {
      ...enemy,
      hp: 380,
      maxhp: enemy.maxhp,
      damage: enemy.damage,
      maxDamage: enemy.maxDamage,
      animations: {
        // ...enemy.animations,
        idle: {
          ...enemy.animations.idle,
          width: 1008 / 4,
          height: 304 / 2,
        },
        attack: {
          ...enemy.animations.attack,
          width: 1008 / 4,
          height: 152,
        },
        hit: {
          ...enemy.animations.hit,
          width: 1008 / 4,
          height: 152,
          framex: [3],
        },
      },
    };
  });
};

// console.log("allEnemies:", allEnemies().length);
