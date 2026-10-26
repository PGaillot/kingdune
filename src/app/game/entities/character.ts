import { Camera } from "../camera";
import { GameMeter, METER_UNIT, ScreenPoint } from "../config";
import { Direction } from "./player-controller";

export class Character {
  constructor(
    public x: GameMeter,
    public y: GameMeter,
    readonly width: GameMeter = 1,
    readonly height: GameMeter = 2,
    readonly speed: GameMeter = 3,
    readonly color: string = 'red',
  ) { }



  /** Déplace le personnage en restant dans les bornes [minX, maxX]. */
  move(direction: Direction, deltaSeconds: number, minX: GameMeter, maxX: GameMeter): void {
    const next = this.x + direction * this.speed * deltaSeconds;
    this.x = Math.min(Math.max(next, minX), maxX - this.width);
  };

  run(direction: Direction, deltaSeconds: number, minX: GameMeter, maxX: GameMeter): void {
    const speedFactor: number = 1.3;
    const runSpeed: number = speedFactor * this.speed;
    const next = this.x + direction * runSpeed * deltaSeconds;
    this.x = Math.min(Math.max(next, minX), maxX - this.width);
  };

  draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.fillStyle = this.color;
    const positionInCamera: ScreenPoint = camera.convert({ x: this.x, y: this.y })
    ctx.fillRect(positionInCamera.x, (positionInCamera.y - this.height * METER_UNIT), this.width * METER_UNIT, this.height * METER_UNIT);
  }
}
