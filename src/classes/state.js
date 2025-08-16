export const enemies = [
  {
    music: "kraken-of-the-sea.ogg",
    background: " ",
    name: "Swamp Thing",
    hp: 300,
    maxhp: 300,
    damage: 15,
    maxDamage: 25,
    icon: " ",
    animations: {
      idle: {
        sprite: "gamma-gazer-idle.png",
        width: 1008 / 4,
        height: 304 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "gamma-gazer-idle.png",
        width: 1008 / 4,
        height: 152,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "gamma-gazer-idle.png",
        width: 1010 / 4,
        height: 150,
        framex: [3],
        framey: 1,
      },
    },
  },
  {
    music: "battle-against-machine.mp3",
    background: " ",
    name: "Master Wizard",
    hp: 300,
    maxhp: 300,
    damage: 15,
    maxDamage: 25,
    icon: " ",
    animations: {
      idle: {
        sprite: "gamma-gazer-idle.png",
        width: 1008 / 4,
        height: 304 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "gamma-gazer-atk-hit.png",
        width: 1008 / 4,
        height: 152,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "gamma-gazer-atk-hit.png",
        width: 1010 / 4,
        height: 150,
        framex: [3],
        framey: 1,
      },
    },
  },
  {
    music: "kraken-of-the-sea.ogg",
    background: "bg/battle_bg_0017_01.jpg",
    name: "Gamma Gazer",
    hp: 300,
    maxhp: 300,
    damage: 15,
    maxDamage: 25,
    icon: "gamma-gazer-icon.png",
    animations: {
      idle: {
        sprite: "gamma-gazer-idle.png",
        width: 1008 / 4,
        height: 304 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "gamma-gazer-atk-hit.png",
        width: 1008 / 4,
        height: 152,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "gamma-gazer-atk-hit.png",
        width: 1010 / 4,
        height: 150,
        framex: [3],
        framey: 1,
      },
    },
  },
  {
    music: "battle-against-machine.mp3",
    background: "",
    name: "Lava Golem",
    hp: 300,
    maxhp: 300,
    damage: 15,
    maxDamage: 25,
    icon: "",
    animations: {
      idle: {
        sprite: "",
        width: 1008 / 4,
        height: 304 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "",
        width: 1008 / 4,
        height: 152,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "",
        width: 1010 / 4,
        height: 150,
        framex: [3],
        framey: 1,
      },
    },
  },
  {
    music: "dark_world.ogg",
    background: "",
    name: "Demon",
    hp: 300,
    maxhp: 300,
    damage: 15,
    maxDamage: 25,
    icon: "",
    animations: {
      idle: {
        sprite: "",
        width: 1010 / 4,
        height: 300 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "",
        width: 1010 / 4,
        height: 150,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "",
        width: 1010 / 4,
        height: 150,
        framex: [3],
        framey: 1,
      },
    },
  },
  {
    music: "overworld.ogg",
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
    music: "battle-against-machine.mp3",
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
    const slug = generateSlug(enemy.name);

    return {
      ...enemy,
      slug,
      icon: `enemies/${slug}/${slug}-icon.png`,
      hp: 160,
      maxhp: 160,
      damage: 6,
      maxDamage: 12,
      background: `enemies/${slug}/${slug}-battle_bg.jpg`,
      animations: {
        ...enemy.animations,
        idle: {
          ...enemy.animations.idle,
          sprite: `enemies/${slug}/${slug}-idle.png`,
          width: 1008 / 4,
          height: 304 / 2,
        },
        attack: {
          ...enemy.animations.attack,
          sprite: `enemies/${slug}/${slug}-atk-hit.png`,
          width: 1008 / 4,
          height: 154,
        },
        hit: {
          ...enemy.animations.hit,
          sprite: `enemies/${slug}/${slug}-atk-hit.png`,
          width: 1008 / 4,
          height: 154,
          framex: [3],
        },
      },
    };
  });
};

export function generateSlug(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
