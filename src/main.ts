import { Game } from './app/components/game/game'

const canvas = document.querySelector<HTMLCanvasElement>("#game");

if (canvas) new Game(canvas).start()