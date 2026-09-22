import { Hitbox } from "../../hitbox";

/** -1 = gauche, 0 = immobile, 1 = droite */
export type Direction = -1 | 0 | 1;

export class Character {
  constructor(
    public x: number,
    public y: number,
    readonly width = 30,
    readonly height = 60,
    readonly speed = 200,
    readonly color: string = 'red',
  ) { }

  /** Déplace le personnage en restant dans les bornes [minX, maxX]. */
  move(direction: Direction, deltaSeconds: number, minX: number, maxX: number): void {
    const next = this.x + direction * this.speed * deltaSeconds;
    this.x = Math.min(Math.max(next, minX), maxX - this.width);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
