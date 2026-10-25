import { Camera } from "../camera";
import { SCREEN_HEIGHT, SCREEN_WIDTH, type GameMeter, type ScreenPoint } from "../config";
import { Ground } from "./ground";
import { Tree } from "./tree";

export class World {

    backgroundColor: string = 'blue';
    ground: Ground;
    trees: Tree[] = [];

    /**
     * La classe pour contruire le Terrain, elle prend une Largeur, et retourne la fin
     * de gauche de droite et le centre de celui ci.
     * @param width 
     */
    constructor(public readonly width: GameMeter, treeCount: number = 10) {
        this.ground = new Ground(width);
        this.trees = this.getRandomTreePositions(treeCount).map((x) => new Tree(x));
    }

    public readonly center: GameMeter = 0;


    getRandomTreePositions(treeCount: number): GameMeter[] {

        const available: GameMeter[] = [];
        for (let x = this.leftEnd; x < this.rightEnd; x++) {
            available.push(x);
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

    public get rightEnd(): GameMeter {
        return this.width / 2
    }

    public get leftEnd(): GameMeter {
        return -this.rightEnd
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.ground.draw(ctx, camera);
        this.trees.forEach((tree: Tree) => tree.draw(ctx, camera))
    }
}