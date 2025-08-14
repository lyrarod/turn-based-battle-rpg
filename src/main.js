import "animate.css";
import "./style.css";

import { Game } from "./classes/game";
import { enemies } from "./classes/state";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const game = new Game(canvas);
  // game.init();
  // hud.style.opacity = "1";
  // hud.style.visibility = "visible";
  // playBtn.style.display = "none";

  playBtn.addEventListener("click", () => {
    game.init();
    game.playMusic();
    hud.style.opacity = "1";
    hud.style.visibility = "visible";
    playBtn.style.display = "none";
  });

  // canvas.style.backgroundImage = `url(${enemies[0].background})`;
});
