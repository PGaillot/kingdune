import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { Character, Direction } from '../character';
import { Rabbit } from '../rabbit';
import { Hunter } from '../hunter';
import { World } from '../world';
import { Camera } from '../camera';
import { GROUND_Y, Pixel, SCREEN_HEIGHT, SCREEN_WIDTH } from './config';

@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas
      #game
      [width]="SCREEN_WIDTH"
      [height]="SCREEN_HEIGHT"
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
  private readonly pressedKeys = new Set<string>();
  private ctx: CanvasRenderingContext2D | null = null;
  private frameId = 0;
  private lastTimestamp = 0;

  public readonly world: World = new World(40); // le monde est instancié avec une taille de 40 GameMeter !
  private readonly character = new Character(this.world.center, GROUND_Y);
  public readonly camera: Camera = new Camera(SCREEN_HEIGHT, SCREEN_WIDTH, { x: this.character.x, y: this.character.y })

  private readonly rabbits: Rabbit[] = [];
  private readonly hunter = new Hunter(this.world.center, GROUND_Y)
  protected readonly SCREEN_WIDTH: Pixel = SCREEN_WIDTH;
  protected readonly SCREEN_HEIGHT: Pixel = SCREEN_HEIGHT;



  constructor() {

    for (let index = 0; index < 5; index++) {
      const position: number = Math.round((Math.random()) * this.world.width)
      this.rabbits.push(new Rabbit(position, GROUND_Y))
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

    this.character.move(this.direction, deltaSeconds, this.world.leftEnd, this.world.rightEnd);
    this.camera.follow({ x: this.character.x, y: this.character.y })
    this.rabbits.forEach((rabbit) => {
      rabbit.update(deltaSeconds, this.world.leftEnd, this.world.rightEnd);
    });
    this.hunter.update(deltaSeconds, this.world.leftEnd, this.world.rightEnd)
    this.render();

    this.frameId = requestAnimationFrame((next) => this.loop(next));
  }

  private render(): void {
    if (!this.ctx) {
      return;
    }

    const ctx = this.ctx;
    this.world.draw(ctx, this.camera);

    this.character.draw(ctx, this.camera);
    this.rabbits.forEach((rabbit) => rabbit.draw(ctx, this.camera));
    this.hunter.draw(ctx, this.camera);
  }
}
