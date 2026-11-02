import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { World } from '../../game/world/world';
import { Camera } from '../../game/camera';
import { Pixel, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../game/config';
import { PlayerCharacter } from '../../game/entities/player-character';
import { InputManager } from '../../game/input-manager';
import { PlayerController } from '../../game/entities/player-controller';
import { drawHitbox, Hitbox } from '../../hitbox';

type HitboxObject = { hitbox: Hitbox };

@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas
      #game
      [width]="SCREEN_WIDTH"
      [height]="SCREEN_HEIGHT"
      role="img"
    ></canvas>
  `,
  styleUrl: './game.scss',
  host: {
    '(window:keydown)': 'inputManager.inputPress($event)',
    '(window:keyup)': 'inputManager.inputRelease($event)',
    '(window:blur)': 'inputManager.onBlur()',
  },
})
export class Game {
  protected readonly SCREEN_WIDTH: Pixel = SCREEN_WIDTH;
  protected readonly SCREEN_HEIGHT: Pixel = SCREEN_HEIGHT;
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('game');
  // private readonly pressedKeys = new Set<string>();
  private ctx: CanvasRenderingContext2D | null = null;
  private frameId = 0;
  private lastTimestamp = 0;

  // Monde
  public readonly world: World = new World(40); // rayon de 40 cases autour de la case centrale, soit 81 cases

  // player
  get player(): PlayerCharacter {
    return this.world.player;
  }

  protected inputManager: InputManager = new InputManager();
  protected playerController: PlayerController = new PlayerController(this.inputManager, this.player);

  public readonly camera: Camera = new Camera(SCREEN_HEIGHT, SCREEN_WIDTH, { x: this.player.x, y: this.player.y })


  hitboxDebug: boolean = true;

  private get hitboxObjects(): HitboxObject[] {
    return [
      this.world.sietch,
      { hitbox: this.world.sietchZone },
      // ...this.world.walls
    ]
  }

  constructor() {
    afterNextRender(() => {
      this.ctx = this.canvasRef().nativeElement.getContext('2d');
      this.frameId = requestAnimationFrame((timestamp) => {
        this.loop(timestamp)
      });
    });
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.frameId));
  }

  private loop(timestamp: number): void {
    const deltaSeconds = this.lastTimestamp ? (timestamp - this.lastTimestamp) / 1000 : 0;
    this.lastTimestamp = timestamp;
    this.inputManager.updateClock(timestamp);
    this.playerController.update(deltaSeconds, this.world);
    this.world.update(deltaSeconds)
    this.camera.follow({ x: this.player.x, y: this.player.y })
    this.render();
    this.frameId = requestAnimationFrame((next) => this.loop(next));
  }

  private render(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    this.world.draw(ctx, this.camera);

    // DEBUG
    if (this.hitboxDebug)
      this.hitboxObjects.forEach((object: HitboxObject) => {
        drawHitbox(ctx, this.camera, object.hitbox)
      })
  }
}