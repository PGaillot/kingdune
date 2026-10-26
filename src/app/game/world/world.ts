import { Camera } from "../camera";
import { SCREEN_HEIGHT, SCREEN_WIDTH, type GameMeter } from "../config";
import { Sietch } from "./sietch";
import { Ground } from "./ground";
import { Catchbasin } from "./catchbasin";
import { RockBiome } from "./biomes/rock.biome";

export class World {

    backgroundColor: string = 'blue';
    ground: Ground;
    catchbasins: Catchbasin[] = [];
    sietch: Sietch;

    /**
     * La classe pour contruire le Terrain, elle prend une Largeur, et retourne la fin
     * de gauche de droite et le centre de celui ci.
     * @param radius 
     */
    constructor(public readonly radius: GameMeter, catchbasinCount: number = 4) {
        this.ground = new Ground(this.leftEnd, this.width);
        this.catchbasins = this.getRandomCatchbasinPositions(catchbasinCount).map((x) => new Catchbasin(x));
        this.sietch = new Sietch(this.center);
        const sietchIndex: number = this.ground.toIndex(this.sietch.position - this.sietch.width / 2);
        this.ground.setZone(sietchIndex, this.sietch.width, new RockBiome())
    }

    public readonly center: GameMeter = 0;


    getRandomCatchbasinPositions(catchbasinCount: number): GameMeter[] {
        const available: GameMeter[] = [];
        for (let i = 0; i < this.width; i++) {
            available.push(this.leftEnd + i);
        }

        if (catchbasinCount > available.length) {
            throw new Error(`Impossible de placer ${catchbasinCount} bassin de captage : seulement ${available.length} places.`);
        }

        const positions: GameMeter[] = [];
        for (let i = 0; i < catchbasinCount; i++) {
            const index = Math.floor(Math.random() * available.length);
            const [position] = available.splice(index, 1);
            positions.push(position);
        }
        return positions;
    }

    public get width(): GameMeter {
        return (this.radius * 2) + 1;
    }

    public get rightEnd(): GameMeter {
        return this.radius + 0.5;
    }

    public get leftEnd(): GameMeter {
        return -this.rightEnd;
    }

    public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.ground.draw(ctx, camera);
        this.catchbasins.forEach((catchbasin: Catchbasin) => catchbasin.draw(ctx, camera))
        this.sietch.draw(ctx, camera)

    }
}