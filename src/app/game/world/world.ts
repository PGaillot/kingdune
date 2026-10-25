import { Camera } from "../camera";
import { SCREEN_HEIGHT, SCREEN_WIDTH, type GameMeter, type ScreenPoint } from "../config";
import { Campfire } from "../entities/campfire";
import { MeadowBiome } from "./biomes/meadow.biome";
import { Ground } from "./ground";
import { Tree } from "./tree";

export class World {

    backgroundColor: string = 'blue';
    ground: Ground;
    trees: Tree[] = [];
    campfire: Campfire;

    /**
     * La classe pour contruire le Terrain, elle prend une Largeur, et retourne la fin
     * de gauche de droite et le centre de celui ci.
     * @param radius 
     */
    constructor(public readonly radius: GameMeter, treeCount: number = 4) {
        this.ground = new Ground(this.leftEnd, this.width);
        this.trees = this.getRandomTreePositions(treeCount).map((x) => new Tree(x));
        this.campfire = new Campfire(this.center);
        const campfireIndex: number = this.ground.toIndex(this.campfire.position - this.campfire.width / 2);
        this.ground.setZone(campfireIndex, this.campfire.width, new MeadowBiome())
    }

    public readonly center: GameMeter = 0;


    getRandomTreePositions(treeCount: number): GameMeter[] {
        const available: GameMeter[] = [];
        for (let i = 0; i < this.width; i++) {
            available.push(this.leftEnd + i);
        }

        if (treeCount > available.length) {
            throw new Error(`Impossible de placer ${treeCount} arbres : seulement ${available.length} places.`);
        }

        const positions: GameMeter[] = [];
        for (let i = 0; i < treeCount; i++) {
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
        this.trees.forEach((tree: Tree) => tree.draw(ctx, camera))
        this.campfire.draw(ctx, camera)

    }
}