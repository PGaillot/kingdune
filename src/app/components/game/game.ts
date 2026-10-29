import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { Muaddib } from '../../game/entities/muaddib';
import { Hunter } from '../../game/entities/hunter';
import { World } from '../../game/world/world';
import { Camera } from '../../game/camera';
import { GROUND, Pixel, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../game/config';
import { PlayerCharacter } from '../../game/entities/player-character';
import { InputManager } from '../../game/input-manager';
import { PlayerController } from '../../game/entities/player-controller';
import { Builder } from '../../game/entities/builder';
import { overlaps } from '../../hitbox';
import { Collectible } from '../../game/entities/collectible';

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
  private readonly player = new PlayerCharacter(this.world.center - 0.5, GROUND);
  protected inputManager: InputManager = new InputManager();
  protected playerController: PlayerController = new PlayerController(this.inputManager, this.player);

  public readonly camera: Camera = new Camera(SCREEN_HEIGHT, SCREEN_WIDTH, { x: this.player.x, y: this.player.y })

  private readonly muaddibs: Muaddib[] = [];
  private readonly hunter = new Hunter(this.world.center, GROUND)
  private readonly builder = new Builder(-3, GROUND)

  constructor() {
    for (let index = 0; index < 5; index++) {
      const position: number = Math.round((Math.random()) * this.world.width)
      this.muaddibs.push(new Muaddib(position, GROUND))
    }

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

    this.world.collectibles.forEach((collectible: Collectible) => {
      collectible.update();
      if (overlaps(this.player.hitbox, collectible.hitbox) && collectible.canBePickedBy(this.player)) {
        const collectibleOverflow: Collectible | undefined = this.player.purse.add(collectible);
        if (collectibleOverflow === undefined) {
          this.world.collectibles = this.world.collectibles.filter((other: Collectible) => other !== collectible)
        }
      }
    })

    this.camera.follow({ x: this.player.x, y: this.player.y })
    this.muaddibs.forEach((muaddib) => {
      muaddib.update(deltaSeconds, this.world.leftEnd, this.world.rightEnd);
    });

    this.hunter.update(deltaSeconds, this.world.leftEnd, this.world.rightEnd);
    this.builder.update(deltaSeconds, this.world.leftEnd, this.world.rightEnd)
    this.render();

    this.frameId = requestAnimationFrame((next) => this.loop(next));
  }

  private render(): void {
    if (!this.ctx) {
      return;
    }

    const ctx = this.ctx;
    this.world.draw(ctx, this.camera, this.player.target);
    this.player.draw(ctx, this.camera);
    this.muaddibs.forEach((muaddib: Muaddib) => muaddib.draw(ctx, this.camera));
    this.hunter.draw(ctx, this.camera);
    this.builder.draw(ctx, this.camera);
  }
}
