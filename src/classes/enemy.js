import { allEnemies } from "./state";

export class Enemy {
  constructor(game) {
    this.game = game;
    this.enemies = allEnemies();
    this.currentEnemy = Math.floor(Math.random() * allEnemies().length);
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.idx = 0;
    this.framex = 0;
    this.idy = 0;
    this.framey = 0;
    this.sprite = new Image();
    this.scale = 3;
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

    this.attackAudios = {
      attack: new Audio("33HitFist.wav"),
      furiousAttack: new Audio("Dragon_Attack_2.mp3"),
    };
    this.attackAudio = null;

    this.animations = {};

    this.defeated = false;
    this.timer = null;

    this.playAnimation("idle");
    this.music = new Audio(`musics/${this.enemies[this.currentEnemy].music}`);

    canvas.style.backgroundImage = `url(${
      this.enemies[this.currentEnemy].background
    })`;

    this.attacks = [
      ...Array(2).fill(this.attack),
      ...Array(1).fill(this.furiousAttack),
    ];
    this.currentAtk = null;

    this.frameNo = 0;
  }

  playAnimation(animation = "idle", config = { loop: true }) {
    const currentAnimation =
      this.enemies[this.currentEnemy].animations[animation];

    this.idx = 0;
    this.idy = 0;
    this.frame = 0;
    this.loop = config.loop;
    this.sprite.src = currentAnimation.sprite;
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
    this.music.src = "";
    this.music = new Audio(`musics/${this.enemies[this.currentEnemy].music}`);
    this.music.currentTime = 0;
    this.music.loop = true;
    this.music.volume = 0.2;
    this.music.play();
  }

  nextEnemy() {
    this.currentEnemy = (this.currentEnemy + 1) % this.enemies.length;
    this.name = this.enemies[this.currentEnemy].name;
    this.hp = this.enemies[this.currentEnemy].hp;
    this.maxhp = this.enemies[this.currentEnemy].maxhp;
    this.damage = this.enemies[this.currentEnemy].damage;
    this.maxDamage = this.enemies[this.currentEnemy].maxDamage;
    this.icon = this.enemies[this.currentEnemy].icon;

    this.avatarEl.src = this.icon;
    this.hpEl.innerText = this.hp;
    this.enemyATK.innerText = `${this.damage}-${this.maxDamage}`;

    this.defeated = false;
    this.game.playerTurn = true;
    this.game.hero.removeDialog();
    this.playAnimation("idle");
    this.playMusic();
    canvas.style.backgroundImage = `url(${
      this.enemies[this.currentEnemy].background
    })`;

    this.game.hero.hp += 10;
    // this.game.hero.maxhp += 10;
    // this.game.hero.hp = this.game.hero.maxhp;
    this.game.hero.hpEl.innerText = this.game.hero.hp;

    this.game.hero.mp += 1;
    // this.game.hero.maxmp += 1;
    // this.game.hero.mp = this.game.hero.maxmp;
    this.game.hero.mpEl.innerText = this.game.hero.mp;

    this.game.hero.damage += 1;
    this.game.hero.maxDamage += 1;
    this.game.hero.playerATK.innerText = `${this.game.hero.damage}-${this.game.hero.maxDamage}`;

    this.frameNo = 0;
    hud.style.display = "none";
  }

  playAudioAttack({ type = "attack" | "furiousAttack" }) {
    this.attackAudio = this.attackAudios[type];
    this.attackAudio.currentTime = 0;
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
    this.playAudioAttack({ type: "furiousAttack" });

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

    if (this.defeated) {
      let nextEnemy = this.enemies[this.currentEnemy + 1]
        ? this.enemies[this.currentEnemy + 1]
        : this.enemies[0];

      // this.timer = setTimeout(() => {
      //   alert(
      //     `You Won! 🎉 \nYou defeated ${this.name}\nYou next enemy is ${nextEnemy.name}`
      //   );

      //   this.timer = setTimeout(() => {
      //     this.nextEnemy();
      //   }, 1000);
      //   // location.reload();
      // }, 1500);

      return null;
    }

    this.timer = setTimeout(() => {
      this.playAnimation("idle");
    }, 1500);

    this.timer = setTimeout(() => {
      this.randomAttack();
    }, 4000);
  }

  draw() {
    if (!this.game.ctx) return;

    this.game.ctx.drawImage(
      this.sprite,
      this.framex[this.idx] * this.width,
      this.framey[this.idy] * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width * this.scale,
      this.height * this.scale
    );

    // this.game.ctx.strokeStyle = "white";
    // this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  update(deltaTime) {
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
