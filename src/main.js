import "animate.css";
import "./style.css";

import { Game } from "./classes/game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const game = new Game(canvas);

  // game.init();
  // game.playMusic();
  // playBtn.style.display = "none";

  playBtn.addEventListener("click", () => {
    game.init();
    game.playMusic();
    playBtn.style.display = "none";
  });
});
