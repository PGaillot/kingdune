import { World } from '../../game/world/world';
import { Camera } from '../../game/camera';
import { Pixel, SCREEN_HEIGHT, SCREEN_WIDTH, Second, WORLD_RADIUS } from '../../game/config';
import { PlayerCharacter } from '../../game/entities/player-character';
import { InputManager } from '../../game/input-manager';
import { PlayerController } from '../../game/entities/player-controller';
import { drawHitbox, Hitbox } from '../../hitbox';

type HitboxObject = { hitbox: Hitbox };

export class Game {

  constructor(canvas: HTMLCanvasElement) {
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx === null) throw new Error("Pas de context 2D dans le canvas ...")
    this.ctx = ctx;


    window.addEventListener('keydown', (event: KeyboardEvent) => this.inputManager.inputPress(event));
    window.addEventListener('keyup', (event: KeyboardEvent) => this.inputManager.inputRelease(event));
    window.addEventListener('blur', (event: FocusEvent) => this.inputManager.onBlur());
  }

  protected readonly SCREEN_WIDTH: Pixel = SCREEN_WIDTH;
  protected readonly SCREEN_HEIGHT: Pixel = SCREEN_HEIGHT;
  // private readonly pressedKeys = new Set<string>();
  private ctx: CanvasRenderingContext2D | null = null;
  private lastTimestamp = 0;

  // Monde
  public readonly world: World = new World(WORLD_RADIUS); // rayon de 40 cases autour de la case centrale, soit 81 cases

  protected inputManager: InputManager = new InputManager();
  protected playerController: PlayerController = new PlayerController(this.inputManager, this.player);
  public readonly camera: Camera = new Camera(SCREEN_HEIGHT, SCREEN_WIDTH, { x: this.player.x, y: this.player.y })

  private readonly hitboxDebug: boolean = true;

  // player
  get player(): PlayerCharacter {
    return this.world.player;
  }

  start(): void {
    requestAnimationFrame((instant) => this.loop(instant));
  }

  private get hitboxObjects(): HitboxObject[] {
    return [
      this.world.sietch,
      { hitbox: this.world.sietchZone },
      // ...this.world.walls
    ]
  }

  private loop(timestamp: number): void {
    const deltaSeconds = this.lastTimestamp ? (timestamp - this.lastTimestamp) / 1000 : 0;
    this.lastTimestamp = timestamp;
    this.inputManager.updateClock(timestamp);
    this.playerController.update(deltaSeconds, this.world);
    this.world.update(deltaSeconds)
    this.camera.follow({ x: this.player.x, y: this.player.y })
    this.render();
    requestAnimationFrame((next: Second) => this.loop(next))
  }

  private render(): void {
    if (this.ctx === null) return;
    const ctx: CanvasRenderingContext2D = this.ctx;
    this.world.draw(ctx, this.camera);

    // HITBOX DEBUG
    if (this.hitboxDebug)
      this.hitboxObjects.forEach((object: HitboxObject) => {
        drawHitbox(ctx, this.camera, object.hitbox)
      })
  }
}