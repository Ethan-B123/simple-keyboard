
import Board from "./board";

document.addEventListener("DOMContentLoaded", () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const board = new Board({ audioCtx });
  window.addEventListener("keydown", board.onKeyChange("down").bind(board));
  window.addEventListener("keyup", board.onKeyChange("up").bind(board));
});