import { Game } from './app/game'

const canvas = document.querySelector<HTMLCanvasElement>("#game");

if (canvas) new Game(canvas).start()