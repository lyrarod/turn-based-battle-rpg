export class Hero {
  constructor(game) {
    this.game = game;
    this.hp = 100;
    this.maxhp = 100;
    this.mp = 1;
    this.maxmp = 1;
    this.damage = 5;
    this.maxDamage = 10;
    this.icon = "/unit_icon_202000507.png";
    this.avatarEl = document.getElementById("playerAvatar");
    this.avatarEl.src = this.icon;
    this.name = "Emperor";

    this.attackAudio = "";
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
    // console.log(this.attacks);

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

    this.isDead = false;

    this.healAudio = new Audio("7DHealingSound.wav");
  }

  playAudioAttack({ type = "attack" | "criticalAttack" } = { type: "attack" }) {
    this.attackAudio = this.attackAudios[type];
    this.attackAudio.currentTime = 0;
    this.attackAudio.play();
  }

  heal() {
    if (!this.game.playerTurn) return;
    if (this.hp >= this.maxhp) {
      this.game.playerTurn = true;
      return this.game.showDialog({
        icon: this.icon,
        message: `You are already at full health!`,
      });
    }

    const mpcost = 1;

    if (this.mp < mpcost) {
      this.game.playerTurn = true;
      return this.game.showDialog({
        message: `You don't have enough MP to heal!`,
      });
    }

    this.mp -= mpcost;
    let heal = this.maxhp - this.hp;
    this.hp += heal;
    // console.log("heal:", heal);

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
    // console.log("heroAttack:", damage);

    this.game.enemy.takeDamage(damage);
    this.playAudioAttack({ type: "attack" });

    let message = "";
    message = `<strong><em>${this.name}</em></strong> has attacked!💢<br/>`;
    message += `${this.game.enemy.name} took ${damage} damage.`;

    if (this.game.enemy.defeated) return;

    return this.game.showDialog({ message });
  }

  criticalAttack() {
    if (!this.game.playerTurn) return;
    this.game.playerTurn = false;
    let damage = this.maxDamage * 5; //+ Math.floor(Math.random() * 101);
    // console.log("criticalAttack:", damage);
    this.game.enemy.takeDamage(damage);
    this.playAudioAttack({ type: "criticalAttack" });

    let message = `<strong><em>${this.name}</em></strong> landed a <strong>Critical Hit</strong>!💢<br/>`;
    message += `${this.game.enemy.name} took ${damage} damage.`;

    if (this.game.enemy.defeated) return;

    return this.game.showDialog({ message });
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

    let message = "";

    message = `<strong><em>${this.game.enemy.name}</em></strong> has attacked!💢<br/>`;
    message += `${this.name} took ${damage} damage.`;

    if (this.isDead) {
      message = `<strong><em>${this.game.enemy.name}</em></strong> has won the battle!<br/>`;
      message += `${this.name} took ${damage} damage.<br/>`;

      // this.game.stopMusic();
      return this.game.showDialog({ icon: this.game.enemy.icon, message });
    }

    return this.game.showDialog({
      icon: this.game.enemy.icon,
      message,
    });
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
