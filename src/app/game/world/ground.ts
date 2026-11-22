import { Camera } from "../camera";
import { GameMeter, GROUND, METER_UNIT, Pixel, SCREEN_HEIGHT, SCREEN_WIDTH, ScreenPoint } from "../config";
import { Biome } from "./biomes/biome";
import { RockBiome } from "./biomes/rock.biome";
import { DuneBiome } from "./biomes/dune.biome";


/**
 * Le Sol c'est ce qui permet ne pas tomber vers le centre de la terre.
 * Ici il sert aussi à repartir les biomes même si c'est pas vraiment 
 * correctement implémenté.
 */
export class Ground {

    private borderWidth: GameMeter = 5;

    thickness: GameMeter = 0.2;
    color: string = 'chocolate';
    groundGrid: Biome[] = [];

    constructor(private leftEnd: GameMeter, cellCount: number) {
        for (let i = 0; i < cellCount; i++) {
            this.groundGrid.push(new DuneBiome())
        }
        this.setZone(0, this.borderWidth, new RockBiome());
        this.setZone(cellCount - this.borderWidth, this.borderWidth, new RockBiome());
    }

    private drawBiome(ctx: CanvasRenderingContext2D, camera: Camera, index: number, biome: Biome): void {
        const blocWidth: Pixel = 1 * METER_UNIT;
        ctx.fillStyle = biome.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.leftEnd + index, y: GROUND })
        ctx.fillRect(positionInCamera.x, positionInCamera.y, blocWidth, this.thickness * METER_UNIT);
    }

    public toIndex(x: GameMeter): number {
        return Math.floor(x - this.leftEnd);
    }

    public setZone(start: GameMeter, size: GameMeter, biome: Biome): void {
        const zone: Biome[] = new Array(size).fill(biome);
        this.groundGrid.splice(start, size, ...zone)
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {

        ctx.fillStyle = "orange";
        ctx.fillRect(0, camera.convert({ x: 0, y: 0 }).y, SCREEN_WIDTH, SCREEN_HEIGHT)

        this.groundGrid.forEach((biome: Biome, index: number) => {
            this.drawBiome(ctx, camera, index, biome)
        });

    }
}