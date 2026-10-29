import { Camera } from "../camera";
import { CENTER, GROUND, SCREEN_HEIGHT, SCREEN_WIDTH, type GameMeter } from "../config";
import { Sietch } from "./sietch";
import { Ground } from "./ground";
import { Catchbasin } from "./catchbasin";
import { RockBiome } from "./biomes/rock.biome";
import { WaterRing } from "../entities/water-ring";
import { Collectible } from "../entities/collectible";
import { Purchasable } from "../interfaces/purchasable";
import { targetHighlight } from "../target-highlight";
import { Wall } from "../entities/wall";
import { mirrored } from "../../utils/mirrored";
import { disperse } from "../../utils/disperse";

export class World {

    backgroundColor: string = 'blue';
    ground: Ground;
    catchbasins: Catchbasin[] = [];
    sietch: Sietch;
    collectibles: Collectible[] = [];
    walls: Wall[] = [];

    /**
     * La classe pour contruire le Terrain, elle prend une Largeur, et retourne la fin
     * de gauche de droite et le centre de celui ci.
     * @param radius 
     */
    constructor(public readonly radius: GameMeter, catchbasinCount: number = 25) {
        this.ground = new Ground(this.leftEnd, this.width);
        this.catchbasins = this.getRandomCatchbasinPositions(catchbasinCount).map((x) => new Catchbasin(x));
        this.sietch = new Sietch();
        this.buildSietchZone();
        this.collectibles.push(...disperse<WaterRing>(15, -15, 15, (x: GameMeter) => new WaterRing(x, GROUND)));
    }


    private buildSietchZone(): void {
        const sietchIndex: number = this.ground.toIndex(this.sietch.position - this.sietch.width / 2);
        this.ground.setZone(sietchIndex, this.sietch.width, new RockBiome());
        this.walls = [...mirrored(6, (x: GameMeter) => new Wall(x)), ...mirrored(20, (x: GameMeter) => new Wall(x))];
    }


    get purchasables(): Purchasable[] {
        return [...this.catchbasins, this.sietch, ...this.walls]
    }

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
    public get center(): GameMeter {
        return CENTER
    };

    public get width(): GameMeter {
        return (this.radius * 2) + 1;
    }

    public get rightEnd(): GameMeter {
        return this.radius + 0.5;
    }

    public get leftEnd(): GameMeter {
        return -this.rightEnd;
    }

    public draw(ctx: CanvasRenderingContext2D, camera: Camera, target: Purchasable | undefined): void {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.ground.draw(ctx, camera);
        this.purchasables.forEach((purchasable: Purchasable) => targetHighlight(ctx, camera, purchasable, target === purchasable))
        this.collectibles.forEach((collectible: Collectible) => collectible.draw(ctx, camera));

    }
}