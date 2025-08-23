import { createElement } from "react";
import { allEnemies } from "./state";

export class Enemy {
  constructor(game) {
    this.game = game;
    this.enemies = allEnemies();
    this.currentEnemy = 0; //Math.floor(Math.random() * allEnemies().length);
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.idx = 0;
    this.framex = 0;
    this.idy = 0;
    this.framey = 0;
    this.scale = game.width < 600 ? 1.3 : 2.3;
    this.frame = 0;
    this.frameInterval = 1000 / 12;
    this.loop = null;
    this.name = this.enemies[this.currentEnemy].name;
    this.hp = this.enemies[this.currentEnemy].hp;
    this.maxhp = this.enemies[this.currentEnemy].maxhp;
    this.damage = this.enemies[this.currentEnemy].damage;
    this.maxDamage = this.enemies[this.currentEnemy].maxDamage;
    this.icon = this.enemies[this.currentEnemy].icon;

    this.avatarEl = document.getElementById("enemyAvatar");
    this.avatarEl.src = this.icon;

    this.hpEl = document.getElementById("enemyHP");
    this.hpEl.innerText = this.hp;
    this.enemyATK = document.getElementById("enemyATK");
    this.enemyATK.innerText = `${this.damage}-${this.maxDamage}`;

    this.attackAudio = null;
    this.attackAudios = {
      attack: new Audio("33HitFist.wav"),
    };

    this.animations = {};

    this.defeated = this.enemies[this.currentEnemy].defeated;
    this.timer = null;

    this.music = new Audio(`/musics/${this.enemies[this.currentEnemy].music}`);

    this.currentAtk = null;
    this.attacks = [
      ...Array(2).fill(this.attack),
      ...Array(1).fill(this.furiousAttack),
    ];

    this.frameNo = 0;
    this.animation = "idle";
    this.playAnimation();

    this.bgImage = new Image();
    this.bgImage.src = this.enemies[this.currentEnemy].background;
    canvas.style.backgroundImage = `url(${this.bgImage.src})`;

    this.sprites = {
      idle: new Image(),
      hit: new Image(),
      attack: new Image(),
    };

    this.sprites["idle"].src =
      this.enemies[this.currentEnemy].animations["idle"].sprite;
    this.sprites["hit"].src =
      this.enemies[this.currentEnemy].animations["attack"].sprite;
    this.sprites["attack"].src =
      this.enemies[this.currentEnemy].animations["attack"].sprite;

    // Smokes
    this.smokes = [0, 1, 3, 4, 7, 8, 9, 14, 15, 18, 19];
    this.randomSmokes = () => {
      return this.smokes[Math.floor(Math.random() * this.smokes.length)];
    };

    let idy = this.randomSmokes();

    this.smoke = {
      width: 1024 / 16,
      height: 1280 / 20,
      x: 0,
      y: 0,
      framex: Array.from({ length: 16 }, (_, i) => i),
      framey: Array.from({ length: 20 }, (_, i) => i),
      idx: 0,
      idy,
      frame: 0,
      frameInterval: 1000 / 24,
      scale: game.width < 600 ? 2 : 3,
      sprite: new Image(),
    };
    this.smoke.sprite.src = "/smoke.png";

    this.audioVictory = new Audio("/ffiv_victory_fanfare.ogg");
    this.audioVictory.volume = 0.1;
    this.audioVictory.loop = false;

    this.assetsImg = [
      this.bgImage,
      this.avatarEl,
      this.sprites["hit"],
      this.sprites["idle"],
      this.sprites["attack"],
    ];

    this.assetsAudio = [
      this.music,
      this.audioVictory,
      this.attackAudios.attack,
    ];

    this.assets = [
      ...this.assetsImg,
      ...this.assetsAudio,
      this.smoke["sprite"],
    ];

    this.count = 0;
    this.isLoaded = false;
  }

  drawSmoke(deltaTime) {
    if (!this.game.ctx || !this.defeated) return;

    this.smoke.x =
      this.game.width * 0.5 - this.smoke.width * 0.5 * this.smoke.scale;
    this.smoke.y =
      this.game.height * 0.5 - this.smoke.height * 0.5 * this.smoke.scale;

    this.game.ctx.drawImage(
      this.smoke["sprite"],
      this.smoke.framex[this.smoke.idx] * this.smoke.width,
      this.smoke.framey[this.smoke.idy] * this.smoke.height,
      this.smoke.width,
      this.smoke.height,
      this.smoke.x,
      this.smoke.y,
      this.smoke.width * this.smoke.scale,
      this.smoke.height * this.smoke.scale
    );

    if (this.smoke.frame > this.smoke.frameInterval) {
      this.smoke.idx++;
      if (this.smoke.idx > this.smoke.framex.length) {
        this.smoke.idx = this.smoke.framex.length;
      }

      this.smoke.frame = 0;
    } else {
      this.smoke.frame += deltaTime;
    }
  }

  playAnimation(
    animation = "idle",
    { loop = true | false } = {
      loop: true,
    }
  ) {
    this.animation = animation;
    const currentAnimation =
      this.enemies[this.currentEnemy].animations[animation];

    this.idx = 0;
    this.idy = 0;
    this.frame = 0;
    this.loop = loop;

    this.width = currentAnimation.width;
    this.height = currentAnimation.height;
    this.framex = Array.isArray(currentAnimation.framex)
      ? currentAnimation.framex
      : Array.from({ length: currentAnimation.framex }, (_, i) => i);

    this.framey = Array.isArray(currentAnimation.framey)
      ? currentAnimation.framey
      : Array.from({ length: currentAnimation.framey }, (_, i) => i);

    this.x = this.game.width * 0.5 - this.width * 0.5 * this.scale;
    this.y = this.game.height * 0.5 - this.height * 0.5 * this.scale;
  }

  playMusic() {
    this.music = new Audio(`musics/${this.enemies[this.currentEnemy].music}`);
    this.music.currentTime = 0;
    this.music.loop = true;
    this.music.volume = 0.2;
    this.music.play().then(() => {});
  }

  stopMusic() {
    this.music.pause();
    this.music.currentTime = 0;
    this.music.src = "";
  }

  loadAssets() {
    this.count = 0;
    this.isLoaded = false;

    this.assetsImg.forEach((asset, i) => {
      // console.log("asset:", asset);
      asset.onload = () => {
        this.count++;
        // console.log("asset onload:", asset);
        if (this.count === this.assetsImg.length) {
          this.isLoaded = true;
          // console.log("loaded onload");
        }
      };

      asset.onerror = () => {
        console.error(`Asset ${i} failed to load: `, asset);
      };
    });
  }

  nextEnemy() {
    this.currentEnemy = (this.currentEnemy + 1) % this.enemies.length;

    this.loadAssets();

    this.smoke.idx = 0;
    this.smoke.frame = 0;
    this.smoke.idy = this.randomSmokes();

    this.name = this.enemies[this.currentEnemy].name;
    this.hp = this.enemies[this.currentEnemy].hp;
    this.maxhp = this.enemies[this.currentEnemy].maxhp;
    this.damage = this.enemies[this.currentEnemy].damage;
    this.maxDamage = this.enemies[this.currentEnemy].maxDamage;
    this.icon = this.enemies[this.currentEnemy].icon;
    this.avatarEl.src = this.icon;

    this.sprites["idle"].src =
      this.enemies[this.currentEnemy].animations.idle.sprite;
    this.sprites["hit"].src =
      this.enemies[this.currentEnemy].animations.attack.sprite;
    this.sprites["attack"].src =
      this.enemies[this.currentEnemy].animations.attack.sprite;

    this.defeated = false;
    this.game.playerTurn = true;

    this.stopMusic();

    this.playAnimation();

    this.bgImage.src = this.enemies[this.currentEnemy].background;
    canvas.style.backgroundImage = `url(${this.bgImage.src})`;

    this.hp += 0;
    this.maxhp += 0;
    this.hp = this.maxhp;
    this.hpEl.innerText = this.hp;

    this.damage += 0;
    this.maxDamage += 0;
    this.enemyATK.innerText = `${this.damage}-${this.maxDamage}`;

    this.game.hero.hp += 10;
    this.game.hero.maxhp += 10;
    this.game.hero.hp = this.game.hero.maxhp;
    this.game.hero.hpEl.innerText = this.game.hero.hp;

    this.game.hero.mp = 1;
    // this.game.hero.mp += 1;
    // this.game.hero.maxmp += 1;
    // this.game.hero.mp = this.game.hero.maxmp;
    this.game.hero.mpEl.innerText = this.game.hero.mp;

    // this.game.hero.damage += 1;
    // this.game.hero.maxDamage += 1;
    // this.game.hero.playerATK.innerText = `${this.game.hero.damage}-${this.game.hero.maxDamage}`;

    this.frameNo = 0;
    hud.style.display = "none";
  }

  playAudioAttack({ type = "attack" | "furiousAttack" }) {
    this.attackAudio = this.attackAudios[type];
    this.attackAudio.currentTime = 0;
    this.attackAudio.volume = 0.5;
    this.attackAudio.play();
  }

  randomAttack() {
    this.currentAttack =
      this.attacks[Math.floor(Math.random() * this.attacks.length)];
    this.currentAttack();
  }

  attack() {
    if (this.game.playerTurn) return;

    this.playAudioAttack({ type: "attack" });
    this.playAnimation("attack", { loop: false });
    hud.classList.add("animate__animated", "animate__shakeY");

    this.timer = setTimeout(() => {
      this.game.playerTurn = true;
      let damage =
        this.damage +
        Math.floor(Math.random() * (this.maxDamage - this.damage) + 1);
      // console.log("enemyAttack:", damage);
      this.playAnimation("idle");
      this.game.hero.takeDamage(damage);
    }, 2000);

    hud.addEventListener("animationend", (e) => {
      e.target.classList.remove("animate__animated", "animate__shakeY");
    });
  }

  furiousAttack() {
    if (this.game.playerTurn) return;
    hud.style.setProperty("--animate-duration", "1.5s");
    hud.classList.add("animate__animated", "animate__hinge");

    this.playAnimation("attack");
    this.playAudioAttack({ type: "attack" });

    this.timer = setTimeout(() => {
      this.game.playerTurn = true;
      let damage = this.maxDamage;
      // console.log("enemyfuriousAttack:", damage);
      this.playAnimation("idle");
      this.game.hero.takeDamage(damage);
    }, 3000);

    hud.addEventListener("animationend", (e) => {
      hud.style.removeProperty("--animate-duration", "1.5s");
      e.target.classList.remove("animate__animated", "animate__hinge");
    });
  }

  takeDamage(damage) {
    this.playAnimation("hit", { loop: false });

    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.defeated = true;
    }
    this.hpEl.innerText = this.hp;

    let message = "";

    if (this.defeated) {
      let nextEnemy = this.enemies[this.currentEnemy + 1]
        ? this.enemies[this.currentEnemy + 1]
        : this.enemies[0];

      message = `<strong>${this.game.hero.name}</strong> defeated ${this.name}!<br/>
        ${this.name} took ${damage} damage.<br/>
        You next enemy is ${nextEnemy.name}.`;

      this.stopMusic();

      this.audioVictory.pause();
      this.audioVictory.currentTime = 0;
      this.audioVictory.play();

      this.timer = setTimeout(() => {
        return this.loadAfterVictory();
      }, 4000);

      return this.game.removeDialog();
      // return this.game.showDialog({ message });
    }

    this.timer = setTimeout(() => {
      this.playAnimation("idle");
    }, 1500);

    this.timer = setTimeout(() => {
      this.randomAttack();
    }, 4000);
  }

  loadAfterVictory() {
    let afterVictory = document.getElementById("afterVictory");
    let nextBtn = document.getElementById("nextBtn");

    afterVictory.style.display = "flex";
    let img = document.querySelector("#afterVictory > img");
    img.src = "/emperor.gif";

    nextBtn.addEventListener("click", (e) => {
      this.nextEnemy();
      e.target.disabled = true;
      e.target.innerText = "Loading...";
      // this.audioVictory.pause();
      // this.audioVictory.currentTime = 0;
    });
  }

  draw() {
    if (!this.game.ctx || this.defeated) return;

    this.game.ctx.drawImage(
      this.sprites[this.animation],
      this.framex[this.idx] * this.width,
      this.framey[this.idy] * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width * this.scale,
      this.height * this.scale
    );
  }

  update(deltaTime) {
    this.drawSmoke(deltaTime);

    // console.log(this.isLoaded);
    if (this.isLoaded === true) {
      setTimeout(() => {
        nextBtn.disabled = false;
        nextBtn.innerText = "Next";
        afterVictory.style.display = "none";

        this.audioVictory.pause();
        this.audioVictory.currentTime = 0;
        this.playMusic();
      }, 5000);
      this.isLoaded = false;
    }

    if (this.frame > this.frameInterval) {
      this.idx++;
      if (this.idx >= this.framex.length) {
        if (this.loop) {
          this.idx = 0;
        } else {
          this.idx = this.framex.length - 1;
        }

        this.idy++;
        if (this.idy >= this.framey.length) {
          if (this.loop) {
            this.idy = 0;
          } else {
            this.idy = this.framey.length - 1;
          }
        }
      }

      this.frame = 0;
    } else {
      this.frame += deltaTime;
    }

    this.frameNo++;
    // console.log(this.frameNo);
    if (this.frameNo >= 60) {
      this.draw();
      if (this.frameNo === 60) {
        hud.style.display = "flex";
        hud.style.pointerEvents = "none";
        hud.classList.add("animate__animated", "animate__backInUp");
      } else {
        hud.addEventListener("animationend", (e) => {
          hud.style.pointerEvents = "auto";
          e.target.classList.remove("animate__animated", "animate__backInUp");
        });
      }
    }
  }
}
