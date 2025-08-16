import { Hero } from "./hero";
import { Enemy } from "./enemy";

export class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.playerTurn = true;
    this.enemy = new Enemy(this);
    this.hero = new Hero(this);
    this.lastTime = 0;

    this.gameObjects = [this.enemy, this.hero];

    this.gameEl = document.getElementById("game");
    this.canvasEl = document.getElementById("canvas");

    this.musics = [
      "musics/battle-against-machine.mp3",
      "musics/dark_world.ogg",
      "musics/kraken-of-the-sea.ogg",
      "musics/overworld.ogg",
    ];
    this.randomMusic = new Audio(
      this.musics[Math.floor(Math.random() * this.musics.length)]
    );

    this.count = 0;
    this.loaded = false;
    this.assets = [...this.enemy.assets];

    this.assets.forEach((asset, i) => {
      asset.onload = () => {
        this.count++;
      };

      asset.oncanplay = () => {
        this.count++;
        if (this.count === this.assets.length) {
          this.loaded = true;
          playBtn.disabled = false;
          playBtn.innerText = "Play Now";
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
    this.loop();
    this.playMusic();
  }

  playMusic() {
    this.enemy.playMusic();
  }

  gameOver() {
    alert("😱 Game Over... \n You lost \n Try Again.");
    location.reload();
  }
}
