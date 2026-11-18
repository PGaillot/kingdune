import { World } from './game/world/world';
import { Camera } from './game/camera';
import { SCREEN_HEIGHT, SCREEN_WIDTH, WORLD_RADIUS } from './game/config';
import { PlayerCharacter } from './game/entities/player-character';
import { InputManager } from './game/input-manager';
import { PlayerController } from './game/entities/player-controller';
import { drawHitbox, Hitbox } from './hitbox';

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

  private ctx: CanvasRenderingContext2D;
  private lastTimestamp = 0;

  // Monde
  public readonly world: World = new World(WORLD_RADIUS); // rayon de 40 cases autour de la case centrale, soit 81 cases

  private inputManager: InputManager = new InputManager();
  private playerController: PlayerController = new PlayerController(this.inputManager, this.player);
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
    // const huntZones:{hitbox:Hitbox}[] = this.world.hunters.map((hunter:Hunter) => ({hitbox:hunter.huntZone}));
    return [
      // this.world.sietch,
      // { hitbox: this.world.sietchZone },
      // ...this.world.walls,
      // ...huntZones
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
    requestAnimationFrame((next: number) => this.loop(next))
  }

  private render(): void {
    this.world.draw(this.ctx, this.camera);

    // HITBOX DEBUG
    if (this.hitboxDebug)
      this.hitboxObjects.forEach((object: HitboxObject) => {
        drawHitbox(this.ctx, this.camera, object.hitbox)
      })
  }
}