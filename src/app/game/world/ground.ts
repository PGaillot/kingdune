import { Camera } from "../camera";
import { GameMeter, GROUND_Y, METER_UNIT, Pixel, ScreenPoint } from "../config";
import { Biome } from "./biomes/biome";
import { ForestBiome } from "./biomes/forest.biome";
import { MeadowBiome } from "./biomes/meadow.biome";

export class Ground {

    thickness: GameMeter = 0.2;
    color: string = 'chocolate';
    groundGrid: Biome[] = [];

    constructor(private leftEnd: GameMeter, cellCount: number) {
        for (let i = 0; i < cellCount; i++) {
            this.groundGrid.push(new MeadowBiome())
        }

        // this.groundGrid.toSpliced((width / 2 - 2), (width / 2 + 2), new ForestBiome())
    }

    private drawBiome(ctx: CanvasRenderingContext2D, camera: Camera, index: number, biome: Biome): void {
        const blocWidth: Pixel = 1 * METER_UNIT;

        ctx.fillStyle = biome.color;
        const positionInCamera: ScreenPoint = camera.convert({ x: this.leftEnd + index, y: GROUND_Y })
        ctx.fillRect(positionInCamera.x, positionInCamera.y, blocWidth, this.thickness * METER_UNIT);
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        this.groundGrid.forEach((biome: Biome, index: number) => {
            this.drawBiome(ctx, camera, index, biome)
        });
    }
}