export class Hero {
  constructor(game) {
    this.game = game;
    this.hp = 100;
    this.maxhp = 100;
    this.mp = 100;
    this.maxmp = 100;
    this.damage = 10;
    this.icon = "unit_icon_202000507.png";
    this.avatarEl = document.getElementById("playerAvatar");
    this.avatarEl.src = this.icon;
    this.name = "Hero";

    this.attacks = [
      ...Array(2).fill(this.attack),
      ...Array(1).fill(this.criticalAttack),
    ];
    this.currentAttack = null;
    // console.log(this.attacks);

    this.attackAudios = {
      attack: new Audio("8BClawSlash.wav"),
      criticalAttack: new Audio("2ESwordSlashLong.wav"),
    };
    this.attackAudio = "";

    this.hpEl = document.getElementById("playerHP");
    this.hpEl.innerText = this.hp;
    this.mpEl = document.getElementById("playerMP");
    this.mpEl.innerText = this.mp;
    this.attackBtn = document.getElementById("attackBtn");
    this.healBtn = document.getElementById("healBtn");
    this.healBtn.disabled = true;
    this.buttons = document.querySelectorAll(".btn");

    this.buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (e.target.id === "attackBtn") {
          this.currentAttack =
            this.attacks[Math.floor(Math.random() * this.attacks.length)];
          this.currentAttack();
          // console.log(this.currentAttack);
        }

        if (e.target.id === "healBtn") {
          this.heal();
        }
      });
    });

    this.dialogEl = document.getElementById("dialog");
    this.dialogText = document.getElementById("dialogText");
    this.dialogIcon = document.getElementById("dialogIcon");
    this.timer = null;
    this.isDead = false;

    this.healAudio = new Audio("7DHealingSound.wav");
  }

  playAudioAttack({ type = "attack" | "criticalAttack" }) {
    this.attackAudio = this.attackAudios[type];
    this.attackAudio.currentTime = 0;
    this.attackAudio.play();
  }

  showDialog(config = { icon: "", message: "" }) {
    this.removeDialog(3000);
    this.dialogIcon.src = config.icon ?? this.icon;
    this.dialogText.innerText = config.message;
    this.dialogEl.style.display = "flex";
    this.dialogEl.style.opacity = 1;
    this.dialogEl.style.visibility = "visible";
  }

  removeDialog(timer = 0) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.dialogEl.style.opacity = 0;
      this.dialogEl.style.visibility = "hidden";
    }, timer);
  }

  heal() {
    if (!this.game.playerTurn) return;
    const mpcost = 25;
    if (this.hp >= this.maxhp) {
      this.game.playerTurn = true;
      return this.showDialog({ message: `You are already at full health!` });
    }
    if (this.mp < mpcost) {
      this.game.playerTurn = true;
      return this.showDialog({ message: `You don't have enough MP to heal!` });
    }
    this.healAudio.currentTime = 0;
    this.healAudio.play();
    this.mp -= mpcost;
    let heal = 30 + Math.floor(Math.random() * 71);
    this.hp += heal;
    // console.log("heal:", heal);
    if (this.hp > this.maxhp) {
      this.hp = this.maxhp;
    }
    this.mpEl.innerText = this.mp;
    this.hpEl.innerText = this.hp;
    this.showDialog({ message: `You healed for ${heal} HP.` });

    this.timer = setTimeout(() => {
      this.game.enemy.furiousAttack();
    }, 2500);

    this.game.playerTurn = false;
  }

  attack() {
    if (!this.game.playerTurn) return;
    this.game.playerTurn = false;
    let damage = this.damage + Math.floor(Math.random() * 16);
    // console.log("attack:", damage);

    this.game.enemy.takeDamage(damage);
    this.playAudioAttack({ type: "attack" });
    this.showDialog({ message: `${this.name} dealt ${damage} damage.` });
  }

  criticalAttack() {
    if (!this.game.playerTurn) return;
    this.game.playerTurn = false;
    let damage = this.damage * 10 + Math.floor(Math.random() * 101);
    // console.log("attack:", damage);
    this.game.enemy.takeDamage(damage);
    this.playAudioAttack({ type: "criticalAttack" });
    this.showDialog({
      message: `Critical Attack! ✔ \n ${this.name} dealt ${damage} damage.`,
    });
  }

  takeDamage(damage) {
    if (!this.game.playerTurn) return;
    this.hp -= damage;
    // console.log("takeDamage:", damage);

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
    this.hpEl.innerText = this.hp;

    this.showDialog({
      icon: this.game.enemy.icon,
      message: `${this.game.enemy.name} dealt ${damage} damage.`,
    });

    if (this.isDead) {
      setTimeout(() => {
        this.game.gameOver();
      }, 1000);

      return null;
    }
  }

  update() {
    this.attackBtn.disabled = false;
    this.healBtn.disabled = false;

    if (!this.game.playerTurn || this.isDead) {
      this.attackBtn.disabled = true;
      this.healBtn.disabled = true;
    }
  }
}
