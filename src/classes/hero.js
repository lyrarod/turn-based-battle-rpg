export class Hero {
  constructor(game) {
    this.game = game;
    this.hp = 80;
    this.maxhp = 80;
    this.mp = 1;
    this.maxmp = 1;
    this.damage = 3;
    this.maxDamage = 8;
    this.icon = "unit_icon_202000507.png";
    this.avatarEl = document.getElementById("playerAvatar");
    this.avatarEl.src = this.icon;
    this.name = "Hero";

    this.attackAudios = {
      attack: new Audio("8BClawSlash.wav"),
      criticalAttack: new Audio("2ESwordSlashLong.wav"),
    };
    this.attackAudio = "";

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

    this.attacks = [
      ...Array(1).fill(this.attack),
      ...Array(1).fill(this.criticalAttack),
    ];
    this.currentAttack = null;
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
    if (this.hp >= this.maxhp) {
      this.game.playerTurn = true;
      return this.showDialog({ message: `You are already at full health!` });
    }

    const mpcost = 1;

    if (this.mp < mpcost) {
      this.game.playerTurn = true;
      return this.showDialog({ message: `You don't have enough MP to heal!` });
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
    this.showDialog({ message: `You healed for ${heal} HP.` });

    this.timer = setTimeout(() => {
      this.game.enemy.randomAttack();
    }, 2500);

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
    this.showDialog({ message: `${this.name} dealt ${damage} damage.` });
  }

  criticalAttack() {
    if (!this.game.playerTurn) return;
    this.game.playerTurn = false;
    let damage = this.maxDamage * 5; //+ Math.floor(Math.random() * 101);
    // console.log("criticalAttack:", damage);
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
