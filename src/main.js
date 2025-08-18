import "./style.css";
import "animate.css";

import { Game } from "./classes/game";

playBtn.innerText = "Loading...";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const game = new Game(canvas);

  playBtn.addEventListener("click", (e) => {
    game.init();
    e.target.style.display = "none";
    splash.style.display = "none";
  });
});
