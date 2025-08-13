import { enemies } from "./state";

export class Enemy {
  constructor(game) {
    this.game = game;
    this.currentEnemy = 0;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.idx = 0;
    this.framex = 0;
    this.idy = 0;
    this.framey = 0;
    this.sprite = new Image();
    this.sprite.src = "";
    this.frame = 0;
    this.frameInterval = 1000 / 12;
    this.loop = null;
    this.name = enemies[this.currentEnemy].name;
    this.hp = enemies[this.currentEnemy].hp;
    this.maxhp = enemies[this.currentEnemy].maxhp;
    this.damage = enemies[this.currentEnemy].damage;
    this.maxDamage = enemies[this.currentEnemy].maxDamage;
    this.icon = enemies[this.currentEnemy].icon;

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
    this.attackAudio = "";

    this.animations = {};

    this.defeated = false;
    this.timer = null;

    this.playAnimation("idle");
    this.music = new Audio(`musics/${enemies[this.currentEnemy].music}`);
  }

  playMusic() {
    this.music.src = "";
    this.music = new Audio(`musics/${enemies[this.currentEnemy].music}`);
    this.music.currentTime = 0;
    this.music.loop = true;
    this.music.volume = 0.1;
    this.music.play();
  }

  nextEnemy() {
    this.currentEnemy = (this.currentEnemy + 1) % enemies.length;
    this.name = enemies[this.currentEnemy].name;
    this.hp = enemies[this.currentEnemy].hp;
    this.maxhp = enemies[this.currentEnemy].maxhp;
    this.damage = enemies[this.currentEnemy].damage;
    this.maxDamage = enemies[this.currentEnemy].maxDamage;
    this.icon = enemies[this.currentEnemy].icon;

    this.avatarEl.src = this.icon;
    this.hpEl.innerText = this.hp;
    this.enemyATK.innerText = `${this.damage}-${this.maxDamage}`;

    this.defeated = false;
    this.game.playerTurn = true;
    this.game.hero.removeDialog();
    this.playAnimation("idle");
    this.playMusic();
    canvas.style.backgroundImage = `url(${
      enemies[this.currentEnemy].background
    })`;

    this.game.hero.hp += 10;
    this.game.hero.maxhp += 10;
    this.game.hero.hp = this.game.hero.maxhp;
    this.game.hero.hpEl.innerText = this.game.hero.hp;

    this.game.hero.mp += 5;
    this.game.hero.maxmp += 5;
    this.game.hero.mp = this.game.hero.maxmp;
    this.game.hero.mpEl.innerText = this.game.hero.mp;

    this.game.hero.damage += 1;
    this.game.hero.maxDamage += 1;
    this.game.hero.playerATK.innerText = `${this.game.hero.damage}-${this.game.hero.maxDamage}`;
  }

  playAudioAttack({ type = "attack" | "furiousAttack" }) {
    this.attackAudio = this.attackAudios[type];
    this.attackAudio.currentTime = 0;
    this.attackAudio.play();
  }

  attack() {
    if (this.game.playerTurn) return;
    hud.classList.add("animate__animated", "animate__shakeY");

    this.playAnimation("attack");
    this.playAudioAttack({ type: "attack" });

    this.timer = setTimeout(() => {
      this.game.playerTurn = true;
      let damage =
        this.damage +
        Math.floor(Math.random() * (this.maxDamage - this.damage) + 1);
      console.log("enemyAttack:", damage);
      this.playAnimation("idle");
      this.game.hero.takeDamage(damage);
    }, 2000);

    hud.addEventListener("animationend", (e) => {
      e.target.classList.remove("animate__animated", "animate__shakeY");
    });
  }

  furiousAttack() {
    if (this.game.playerTurn) return;
    hud.classList.add("animate__animated", "animate__shakeX");

    this.playAnimation("attack");
    this.playAudioAttack({ type: "attack" });

    this.timer = setTimeout(() => {
      this.game.playerTurn = true;
      let damage = this.maxDamage;
      console.log("enemyfuriousAttack:", damage);

      this.playAnimation("idle");
      this.game.hero.takeDamage(damage);
    }, 3000);

    hud.addEventListener("animationend", (e) => {
      e.target.classList.remove("animate__animated", "animate__shakeX");
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
      let nextEnemy = enemies[this.currentEnemy + 1]
        ? enemies[this.currentEnemy + 1]
        : enemies[0];

      this.timer = setTimeout(() => {
        alert(
          `You Won! 🎉 \nYou defeated ${this.name}\nYou next enemy is ${nextEnemy.name}`
        );

        this.timer = setTimeout(() => {
          this.nextEnemy();
        }, 1000);
        // location.reload();
      }, 1500);

      return null;
    }

    this.timer = setTimeout(() => {
      this.playAnimation("idle");
    }, 1500);

    this.timer = setTimeout(() => {
      this.attack();
    }, 4000);
  }

  playAnimation(animation, config = { loop: true }) {
    const currentAnimation = enemies[this.currentEnemy].animations[animation];
    this.sprite.src = currentAnimation.sprite;
    this.width = currentAnimation.width;
    this.height = currentAnimation.height;
    this.framex = Array.isArray(currentAnimation.framex)
      ? currentAnimation.framex
      : Array.from({ length: currentAnimation.framex }, (_, index) => index);

    this.framey = Array.from({ length: currentAnimation.framey }).map(
      (_, i) => i
    );
    this.loop = config.loop;

    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height * 0.5 - this.height * 0.5 + 100;
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
      this.width,
      this.height
    );

    // this.game.ctx.strokeStyle = "white";
    // this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  update(deltaTime) {
    this.draw();

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
  }
}
