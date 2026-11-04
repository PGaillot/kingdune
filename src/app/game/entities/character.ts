import { Hitbox } from "../../hitbox";
import { Camera } from "../camera";
import { GameMeter, METER_UNIT, ScreenPoint, Second } from "../config";
import { Direction } from "../config";

export type CharacterOptions = {
  readonly width: GameMeter,
  readonly height: GameMeter,
  readonly speed: GameMeter,
  readonly color: string,
  readonly runFactor: number,
}

const DEFAULT_CHARACTER: CharacterOptions = {
  width: 1,
  height: 2,
  speed: 1.75,
  color: 'red',
  runFactor: 1.85,
}

export class Character {

  readonly options: CharacterOptions;

  constructor(
    public x: GameMeter,
    public y: GameMeter,
    public readonly worldStart: GameMeter,
    public readonly worldEnd: GameMeter,
    options?: Partial<CharacterOptions>,
  ) {
    this.options = { ...DEFAULT_CHARACTER, ...options };
  }

  get runSpeed(): GameMeter {
    return this.options.runFactor * this.options.speed;
  }

  get hitbox(): Hitbox {
    return {
      height: this.options.height,
      width: this.options.width,
      x: this.x - (this.options.width / 2),
      y: this.y
    }
  }

  /** Déplace le personnage en restant dans les bornes [worldStart, worldEnd]. */
  protected move(direction: Direction, speed: number, deltaSeconds: Second): void {
    const next: GameMeter = this.x + direction * speed * deltaSeconds;
    const haflCharacter: GameMeter = this.hitbox.width / 2;
    this.x = Math.min(Math.max(next, this.worldStart + haflCharacter), this.worldEnd - haflCharacter);
  };

  walk(direction: Direction, deltaSeconds: Second): void {
    this.move(direction, this.options.speed, deltaSeconds)
  }

  run(direction: Direction, deltaSeconds: Second): void {
    this.move(direction, this.runSpeed, deltaSeconds)
  };

  draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.fillStyle = this.options.color;
    const positionInCamera: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y })
    ctx.fillRect(positionInCamera.x, (positionInCamera.y - this.options.height * METER_UNIT), this.options.width * METER_UNIT, this.options.height * METER_UNIT);
  }
}
