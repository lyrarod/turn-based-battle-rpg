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
    this.frameInterval = 1000 / 12;
    this.loop = null;
    this.hp = 300;
    this.maxhp = 300;
    this.damage = 10;
    this.maxDamage = 30;
    this.icon = "frost-dragon-icon.png";
    this.avatarEl = document.getElementById("enemyAvatar");
    this.avatarEl.src = this.icon;
    this.name = "Frost Dragon";

    this.hpEl = document.getElementById("enemyHP");
    this.hpEl.innerText = this.hp;

    this.attackAudios = {
      attack: new Audio("33HitFist.wav"),
      furiousAttack: new Audio("Dragon_Attack_2.mp3"),
    };
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
    this.playAnimation("idle");

    this.sprite_action = {
      idle: new Image(),
      attack: new Image(),
      hit: new Image(),
    };
    this.sprite_action.idle.src = "frost-dragon-idle.png";
    this.sprite_action.attack.src = "frost-dragon-attack.png";
    this.sprite_action.hit.src = "frost-dragon-hit.png";

    this.isAttacking = false;
    this.isTakeDamage = false;

    this.enemyATK = document.getElementById("enemyATK");
    this.enemyATK.innerText = `${this.damage}~${this.maxDamage}`;
    this.timer = null;
  }

  playAudioAttack({ type = "attack" | "furiousAttack" }) {
    this.attackAudio = this.attackAudios[type];
    this.attackAudio.currentTime = 0;
    this.attackAudio.play();
  }

  attack() {
    if (this.game.playerTurn) return;
    this.isAttacking = true;
    hud.classList.add("animate__animated", "animate__shakeX");

    this.playAudioAttack({ type: "attack" });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.game.playerTurn = true;
      let damage = this.damage + Math.floor(Math.random() * 11);
      this.game.hero.takeDamage(damage);
      this.isAttacking = false;
    }, 2500);

    hud.addEventListener("animationend", (e) => {
      e.target.classList.remove("animate__animated", "animate__shakeX");
    });
  }

  furiousAttack() {
    if (this.game.playerTurn) return;
    this.isAttacking = true;
    hud.classList.add("animate__animated", "animate__shakeX");

    this.playAudioAttack({ type: "furiousAttack" });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.game.playerTurn = true;
      let damage =
        this.damage + Math.floor(Math.random() * (this.maxDamage - 9));
      // console.log("furiousAttack:", damage);
      this.game.hero.takeDamage(damage);
      this.isAttacking = false;
    }, 2500);

    hud.addEventListener("animationend", (e) => {
      e.target.classList.remove("animate__animated", "animate__shakeX");
    });
  }

  takeDamage(damage) {
    this.isTakeDamage = true;

    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.defeated = true;
    }
    this.hpEl.innerText = this.hp;

    clearTimeout(this.timer);

    if (this.defeated) {
      this.timer = setTimeout(() => {
        alert(`You Won! 🎉 \nYou defeated ${this.name}.`);
        location.reload();
      }, 1500);

      return null;
    }

    this.timer = setTimeout(() => {
      this.isTakeDamage = false;
    }, 1500);

    this.timer = setTimeout(() => {
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

    if (this.isTakeDamage) {
      this.game.ctx.drawImage(
        this.sprite_action.hit,
        this.x,
        this.y,
        this.width,
        this.height
      );

      return null;
    }

    if (this.isAttacking) {
      this.width = this.animations["attack"].width;
      this.height = this.animations["attack"].height;
      this.framex = Array.from({
        length: this.animations["attack"].framex,
      }).map((_, i) => i);
      this.framey = Array.from({
        length: this.animations["attack"].framey,
      }).map((_, i) => i);
      this.loop = true;

      this.game.ctx.drawImage(
        this.sprite_action.attack,
        this.framex[this.idx] * this.width,
        this.framey[this.idy] * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );

      return null;
    }

    this.width = this.animations["idle"].width;
    this.height = this.animations["idle"].height;
    this.framex = Array.from({
      length: this.animations["idle"].framex,
    }).map((_, i) => i);
    this.framey = Array.from({
      length: this.animations["idle"].framey,
    }).map((_, i) => i);
    this.loop = true;

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

    // this.frame++;
  }
}
