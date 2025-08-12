import "animate.css";
import "./style.css";

import { Game } from "./classes/game";

let randomImage = () => {
  let images = [
    "bg/battle_bg_0005_01.jpg",
    "bg/battle_bg_0002_03.jpg",
    "bg/battle_bg_0005_01.jpg",
    "bg/battle_bg_0009_01.jpg",
    "bg/battle_bg_0017_01.jpg",
  ];
  return images[Math.floor(Math.random() * images.length)];
};

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const game = new Game(canvas);
  playBtn.addEventListener("click", () => {
    game.init();
    game.playMusic();
    hud.style.opacity = "1";
    hud.style.visibility = "visible";
    playBtn.style.display = "none";
  });

  canvas.style.backgroundImage = `url(${randomImage()})`;
});
