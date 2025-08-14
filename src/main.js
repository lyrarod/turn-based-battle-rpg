import "animate.css";
import "./style.css";

import { Game } from "./classes/game";
import { enemies } from "./classes/state";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const game = new Game(canvas);

  playBtn.addEventListener("click", () => {
    game.init();
    game.playMusic();
    hud.style.opacity = "1";
    playBtn.style.display = "none";
  });
});
