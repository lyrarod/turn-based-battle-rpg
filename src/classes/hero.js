export class Hero {
  constructor(game) {
    this.game = game;
    this.hp = 40;
    this.maxhp = 40;
    this.mp = 1;
    this.maxmp = 1;
    this.mpCost = 1;
    this.damage = 5;
    this.maxDamage = 10;
    this.icon = "/unit_icon_202000507.png";
    this.avatarEl = document.getElementById("playerAvatar");
    this.avatarEl.src = this.icon;
    this.name = "Emperor";
    this.playerImg = document.getElementById("playerImg");
    this.playerImg.src = "/emperor.gif";

    this.attackAudio = null;
    this.attackAudios = {
      attack: new Audio("8BClawSlash.wav"),
      criticalAttack: new Audio("2ESwordSlashLong.wav"),
    };

    this.hpEl = document.getElementById("playerHP");
    this.hpEl.innerText = this.hp;
    this.mpEl = document.getElementById("playerMP");
    this.mpEl.innerText = this.mp;
    this.playerATK = document.getElementById("playerATK");
    this.playerATK.innerText = `${this.damage}-${this.maxDamage}`;

    this.attackBtn = document.getElementById("attackBtn");
    this.healBtn = document.getElementById("healBtn");
    this.healBtn.disabled = true;
    this.buttons = document.querySelectorAll(".btn");

    this.currentAttack = null;
    this.attacks = [
      ...Array(1).fill(this.attack),
      ...Array(1).fill(this.criticalAttack),
    ];

    this.buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (e.target.id === "attackBtn") {
          this.currentAttack =
            this.attacks[Math.floor(Math.random() * this.attacks.length)];
          this.currentAttack();
        }

        if (e.target.id === "healBtn") {
          this.heal();
        }
      });
    });

    this.isDead = false;

    this.healAudio = new Audio("CBCureSpellPart2.wav");
  }

  playAudioAttack({ type = "attack" | "criticalAttack" } = { type: "attack" }) {
    this.attackAudio = this.attackAudios[type];
    this.attackAudio.currentTime = 0;
    this.attackAudio.volume = 0.5;
    this.attackAudio.play();
  }

  heal() {
    if (!this.game.playerTurn) return;

    this.mp -= this.mpCost;
    let heal = this.maxhp - this.hp;
    this.hp += heal;

    if (this.hp > this.maxhp) {
      this.hp = this.maxhp;
    }

    this.mpEl.innerText = this.mp;
    this.hpEl.innerText = this.hp;
    this.game.showDialog({ message: `You healed for ${heal} HP.` });

    this.timer = setTimeout(() => {
      this.game.enemy.randomAttack();
    }, 3000);

    this.healAudio.currentTime = 0;
    this.healAudio.play();

    this.game.playerTurn = false;
  }

  attack() {
    if (!this.game.playerTurn) return;
    this.game.playerTurn = false;
    let damage =
      this.damage +
      Math.floor(Math.random() * (this.maxDamage - this.damage) + 1);

    this.game.enemy.takeDamage(damage);
    this.playAudioAttack({ type: "attack" });

    let message = "";
    message = `<strong>${this.name}</strong> has attacked!<br/>`;
    message += `${this.game.enemy.name} took ${damage} damage.`;

    if (this.game.enemy.defeated) return null;
    return this.game.showDialog({ message });
  }

  criticalAttack() {
    if (!this.game.playerTurn) return;
    this.game.playerTurn = false;
    let damage = this.maxDamage * 2;
    this.game.enemy.takeDamage(damage);
    this.playAudioAttack({ type: "criticalAttack" });

    let message = `<strong>${this.name}</strong> landed a Critical Hit!<br/>`;
    message += `${this.game.enemy.name} took ${damage} damage.`;

    if (this.game.enemy.defeated) return null;
    return this.game.showDialog({ message });
  }

  takeDamage(damage) {
    if (this.game.playerTurn) return;

    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
    this.hpEl.innerText = this.hp;

    let message = "";

    message = `<strong>${this.game.enemy.name}</strong> has attacked!<br/>`;
    message += `${this.name} took ${damage} damage.`;

    if (this.isDead) {
      message = `<strong>You have been defeated!</strong>💢<br/>`;
      message += `<strong>${this.game.enemy.name}</strong> has won the battle!<br/>`;
      message += `${this.name} took ${damage} damage.<br/>`;

      this.timer = setTimeout(() => {
        location.reload();
      }, 10000);
      return this.game.showDialog({ message });
    }

    return this.game.showDialog({ message });
  }

  update() {
    this.attackBtn.disabled = false;

    if (!this.game.playerTurn || this.isDead) {
      this.healBtn.disabled = true;
      this.attackBtn.disabled = true;
      return null;
    }

    this.healBtn.disabled = false;
    if (this.hp >= this.maxhp || this.mp < this.mpCost) {
      this.healBtn.disabled = true;
      return null;
    }
  }
}
