import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { Character, Direction } from './character';
import { Rabbit } from '../../rabbit';
import { Hunter } from '../../hunter';

const WIDTH = 800;
const HEIGHT = 450;
const GROUND_Y = 390;

@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas
      #game
      width="800"
      height="450"
      role="img"
      aria-label="Zone de jeu : utilisez les flèches gauche et droite pour déplacer le personnage."
    ></canvas>
    <p class="instructions">Flèches ← et → pour déplacer le personnage.</p>
  `,
  styleUrl: './game.scss',
  host: {
    '(window:keydown)': 'onKeyDown($event)',
    '(window:keyup)': 'onKeyUp($event)',
    '(window:blur)': 'onBlur()',
  },
})
export class Game {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('game');
  private readonly character = new Character(WIDTH / 2 - 15, GROUND_Y);
  // private readonly rabbit = new Rabbit(WIDTH / 2 - 100, 425)
  private readonly rabbits: Rabbit[] = [];
  private readonly hunter = new Hunter(WIDTH / 2 - 100, 390)
  private readonly pressedKeys = new Set<string>();

  private ctx: CanvasRenderingContext2D | null = null;
  private frameId = 0;
  private lastTimestamp = 0;

  constructor() {

    for (let index = 0; index < 5; index++) {
      const position: number = Math.round((Math.random()) * WIDTH)
      this.rabbits.push(new Rabbit(position, 425))
    }
    afterNextRender(() => {
      this.ctx = this.canvasRef().nativeElement.getContext('2d');
      this.frameId = requestAnimationFrame((timestamp) => this.loop(timestamp));
    });

    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.frameId));
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      this.pressedKeys.add(event.key);
      event.preventDefault();
    }
  }

  protected onKeyUp(event: KeyboardEvent): void {
    this.pressedKeys.delete(event.key);
  }

  /** Évite qu'une touche reste "coincée" si la fenêtre perd le focus. */
  protected onBlur(): void {
    this.pressedKeys.clear();
  }

  private get direction(): Direction {
    const right = this.pressedKeys.has('ArrowRight') ? 1 : 0;
    const left = this.pressedKeys.has('ArrowLeft') ? 1 : 0;
    return (right - left) as Direction;
  }

  private loop(timestamp: number): void {
    const deltaSeconds = this.lastTimestamp ? (timestamp - this.lastTimestamp) / 1000 : 0;
    this.lastTimestamp = timestamp;

    this.character.move(this.direction, deltaSeconds, 0, WIDTH);
    this.rabbits.forEach((rabbit) => {
      rabbit.update(deltaSeconds, 0, WIDTH);
    });
    this.hunter.update(deltaSeconds, 0, WIDTH)
    this.render();

    this.frameId = requestAnimationFrame((next) => this.loop(next));
  }

  private render(): void {
    if (!this.ctx) {
      return;
    }
    const ctx = this.ctx;
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.character.draw(ctx);
    this.rabbits.forEach((rabbit) => rabbit.draw(ctx));
    this.hunter.draw(ctx);
  }
}
