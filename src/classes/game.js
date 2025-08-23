import { Hero } from "./hero";
import { Enemy } from "./enemy";

export class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.width = canvas.width =
      window.innerWidth > 600 ? 600 : window.innerWidth;
    this.height = canvas.height = window.innerHeight;
    this.playerTurn = true;
    this.enemy = new Enemy(this);
    this.hero = new Hero(this);
    this.lastTime = 0;
    this.timer = null;

    this.gameObjects = [this.enemy, this.hero];

    this.gameEl = document.getElementById("game");
    this.canvasEl = document.getElementById("canvas");
    this.playBtn = document.getElementById("playBtn");

    this.count = 0;
    this.loaded = false;
    this.assets = [...this.enemy.assets];

    const playGame = async (timer = 0) => {
      await new Promise((resolve) => setTimeout(resolve, timer));
      this.playBtn.disabled = false;
      this.playBtn.innerText = "Play Game";
    };

    this.assets.forEach((asset, i) => {
      asset.onload = () => {
        this.count++;
        // console.log("asset onload:", asset);
        if (this.count === this.assets.length) {
          this.loaded = true;
          // console.log("loaded onload");
          playGame(1000);
        }
      };

      asset.oncanplay = () => {
        this.count++;
        // console.log("asset oncanplay:", asset);
        if (this.count === this.assets.length) {
          this.loaded = true;
          // console.log("loaded oncanplay");
          playGame(1000);
        }
      };

      asset.onerror = () => {
        console.error(`Asset ${i} failed to load: `, asset);
      };
    });
  }

  update(deltaTime) {
    if (!this.loaded) return;
    this.gameObjects.forEach((gameObject) => gameObject.update(deltaTime));
  }

  loop = (timeStamp = 0) => {
    let deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    // console.log(Math.floor(deltaTime));
    requestAnimationFrame(this.loop);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update(deltaTime);
  };

  init() {
    requestAnimationFrame(this.loop);
    this.playMusic();
  }

  playMusic() {
    this.enemy.playMusic();
  }

  stopMusic() {
    this.enemy.stopMusic();
  }

  gameOver() {
    alert("😱 Game Over... \n You lost \n Try Again.");
    location.reload();
  }

  showDialog({ message = "" }) {
    dialog.addEventListener("click", () => {
      if (this.enemy.defeated) {
        return this.removeDialog();
        // return this.enemy.nextEnemy();
      }

      if (this.hero.isDead) {
        this.removeDialog();
        return location.reload();
      }

      this.removeDialog(100);
    });

    dialog.style.display = "flex";
    dialogText.innerHTML = message;
  }

  removeDialog(timer = 0) {
    this.timer = setTimeout(() => {
      dialog.style.display = "none";
    }, timer);
  }
}
