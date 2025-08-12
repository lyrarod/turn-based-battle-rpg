export class Enemy {
  constructor(game) {
    this.game = game;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.idx = 0;
    this.framex = Array.from({ length: 0 }).map((_, i) => i);
    this.idy = 0;
    this.framey = Array.from({ length: 0 }).map((_, i) => i);
    this.sprite = new Image();
    this.sprite.src = "";
    this.frame = 0;
    this.loop = null;
    this.hp = 300;
    this.maxhp = 300;
    this.damage = 8;
    this.icon = "frost-dragon-icon.png";
    this.avatarEl = document.getElementById("enemyAvatar");
    this.avatarEl.src = this.icon;
    this.name = "Frost Dragon";

    this.hpEl = document.getElementById("enemyHP");
    this.hpEl.innerText = this.hp;

    this.attackAudios = [
      new Audio("Dragon_Attack_1.mp3"),
      new Audio("Dragon_Attack_2.mp3"),
    ];
    this.attackAudio = "";

    this.animations = {
      idle: {
        sprite: "frost-dragon-idle.png",
        width: 1008 / 4,
        height: 304 / 2,
        framex: 4,
        framey: 2,
      },
      attack: {
        sprite: "frost-dragon-attack.png",
        width: 756 / 3,
        height: 150 / 1,
        framex: 3,
        framey: 1,
      },
      hit: {
        sprite: "frost-dragon-hit.png",
        width: 252,
        height: 152,
        framex: 1,
        framey: 1,
      },
    };

    this.defeated = false;
    this.playAnimation("idle", { loop: true });
  }

  playAudioAttack() {
    this.attackAudio =
      this.attackAudios[Math.floor(Math.random() * this.attackAudios.length)];
    this.attackAudio.currentTime = 0;
    this.attackAudio.play();
  }

  attack() {
    if (this.game.playerTurn) return;
    this.playAnimation("attack", { loop: false });
    this.game.gameEl.classList.add("animate__animated", "animate__shakeX");

    this.playAudioAttack();

    setTimeout(() => {
      this.game.playerTurn = true;
      let damage = this.damage + Math.floor(Math.random() * 12);
      this.game.hero.takeDamage(damage);
      this.playAnimation("idle", { loop: true });
    }, 2500);

    this.game.gameEl.addEventListener("animationend", () => {
      this.game.gameEl.classList.remove("animate__animated", "animate__shakeX");
    });
  }

  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.defeated = true;
    }
    this.hpEl.innerText = this.hp;

    this.playAnimation("hit");

    if (this.defeated) {
      setTimeout(() => {
        alert(`You Won! 🎉 \nYou defeated ${this.name}.`);
        location.reload();
      }, 1500);

      return null;
    }

    setTimeout(() => {
      this.playAnimation("idle", { loop: true });
    }, 1500);

    setTimeout(() => {
      this.attack();
    }, 4000);
  }

  playAnimation(animation, config = { loop: true }) {
    const currentAnimation = this.animations[animation];
    this.sprite.src = currentAnimation.sprite;
    this.width = currentAnimation.width;
    this.height = currentAnimation.height;
    this.framex = Array.from({ length: currentAnimation.framex }).map(
      (_, i) => i
    );
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

  update() {
    this.draw();

    if (this.frame % 8 === 0) {
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
    }

    this.frame++;
  }
}
