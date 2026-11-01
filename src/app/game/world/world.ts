import { Camera } from "../camera";
import { CENTER, DAY_LENGTH, DAY_LIGHT_GRADIENT, Direction, GROUND, METER_UNIT, NIGHT_GRADIENT, Pixel, SCREEN_HEIGHT, SCREEN_WIDTH, type GameMeter } from "../config";
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
import { Workable } from "../interfaces/workable";
import { Worker } from "../entities/worker";
import { centerX, Hitbox, overlaps } from "../../hitbox";
import { Muaddib } from "../entities/muaddib";
import { Hunter } from "../entities/hunter";
import { PlayerCharacter } from "../entities/player-character";
import { Clock } from "../clock";
import { WorldContext } from "../entities/npc";
import { PyonsCamp } from "../entities/pyons-camp";
import { Pyon } from "../entities/pyon";

export class World {
    clock: Clock;
    readonly player: PlayerCharacter;
    readonly ground: Ground;
    catchbasins: Catchbasin[] = [];
    sietch: Sietch;
    collectibles: Collectible[] = [];
    workers: Worker[] = []
    walls: Wall[] = [];
    muaddibs: Muaddib[] = [];
    hunters: Hunter[] = [];
    pyonsCamps: PyonsCamp[] = [];
    pyons: Pyon[] = [];

    /**
     * La classe pour contruire le Terrain, elle prend une Largeur, et retourne la fin
     * de gauche de droite et le centre de celui ci.
     * @param radius 
     */
    constructor(public readonly radius: GameMeter, catchbasinCount: number = 20) {
        this.clock = new Clock(0)
        this.ground = new Ground(this.leftEnd, this.width);
        this.catchbasins = this.getRandomCatchbasinPositions(catchbasinCount).map((x) => new Catchbasin(x));
        this.sietch = new Sietch();
        this.buildSietchZone();
        this.collectibles.push(...disperse<WaterRing>(15, -15, 15, (x: GameMeter) => new WaterRing(x, GROUND)));
        this.hunters.push(new Hunter(this.center, GROUND, this.worldContext));

        this.workers.push(new Worker(1, GROUND, this.worldContext))
        this.player = new PlayerCharacter(this.center, GROUND, this.leftEnd, this.rightEnd);
        for (let index = 0; index < 5; index++) {
            const position: number = Math.round((Math.random()) * this.width)
            this.muaddibs.push(new Muaddib(position, GROUND, this.worldContext))
        }

        this.pyonsCamps.push(new PyonsCamp(-32, this.worldContext))
        this.pyonsCamps.push(new PyonsCamp(34, this.worldContext))

    }

    get worldContext(): WorldContext {
        return {
            sietchZone: this.sietchZone,
            clock: this.clock,
            world: {
                start: this.leftEnd,
                end: this.rightEnd
            }
        }
    }

    get sietchZone(): Hitbox {
        const lastSietchWallLeft: Wall = this.getLastSietchWall(-1);
        const lastSietchWallRight: Wall = this.getLastSietchWall(1);
        const x0: number = lastSietchWallLeft.hitbox.x + lastSietchWallLeft.hitbox.width;
        const x1: number = lastSietchWallRight.hitbox.x;
        return {
            height: 2,
            width: x1 - x0,
            x: x0,
            y: GROUND,
            strokeDebugColor: 'aqua'
        }
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

    get purchasables(): Purchasable[] {
        return [...this.catchbasins, this.sietch, ...this.walls]
    }

    get workersTasks(): Workable[] {
        const workablesInPending: Workable[] = this.workables.filter((workable: Workable) => this.workersOnTask(workable) < workable.workerRequired)
        workablesInPending.sort((a: Workable, b: Workable) => a.requestedAt! - b.requestedAt!)
        return workablesInPending;
    }

    /** Pour connaitre le nombre de Worker sur une tache */
    private workersOnTask(task: Workable): number {
        return this.workers.filter((worker: Worker) => worker.task === task).length;
    }

    // les workers qui attendent du taffs.
    get availableWorkers(): Worker[] {
        return this.workers.filter((worker: Worker) => worker.task === undefined)
    }

    get workables(): Workable[] {
        return [...this.catchbasins]
    }

    private getLastSietchWall(direction: Direction): Wall {
        const walls: Wall[] = this.walls.filter((wall: Wall) => wall.orientation === direction)
        const builtWalls: Wall[] = walls.filter((wall: Wall) => wall.currentLevel > 0);
        if (builtWalls.length >= 1) {
            return builtWalls.reduce((a: Wall, b: Wall) =>
                Math.abs((centerX(a.hitbox) - this.center)) > Math.abs(centerX(b.hitbox) - this.center) ? a : b
            )
        }
        return walls.reduce((a: Wall, b: Wall) =>
            Math.abs((centerX(a.hitbox) - this.center)) < Math.abs(centerX(b.hitbox) - this.center) ? a : b
        )
    }

    /** Distribue les taches entre les workers */
    taskDistributor(): void {
        // qui quel worker est le plus proche et est dispoinible de chaque taches ?
        this.workersTasks.forEach((task: Workable) => {
            const availableWorkers: Worker[] = this.availableWorkers;
            if (availableWorkers.length >= 1) {
                const workerReady: Worker = availableWorkers.reduce((a: Worker, b: Worker) =>
                    Math.abs(centerX(a.hitbox) - centerX(task.hitbox)) < Math.abs(centerX(b.hitbox) - centerX(task.hitbox)) ? a : b
                )
                workerReady.task = task;
            }
        })
    };

    private buildSietchZone(): void {
        const sietchIndex: number = this.ground.toIndex(this.sietch.position - this.sietch.width / 2);
        this.ground.setZone(sietchIndex, this.sietch.width, new RockBiome());
        this.walls = [...mirrored(14, (x: GameMeter) => new Wall(x)), ...mirrored(26, (x: GameMeter) => new Wall(x))];
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

    createCollectible(collectibles: Collectible[]) {
        this.collectibles = [...this.collectibles, ...collectibles]
    }

    public update(deltaSeconds: number) {
        this.clock.updateClock(deltaSeconds);

        this.catchbasins = this.catchbasins.filter((catchbasin: Catchbasin) => {
            const completeCatchbasin: boolean = catchbasin.workChargeLeft <= 0;
            if (completeCatchbasin) {
                const reward: WaterRing[] = catchbasin.complete();
                this.createCollectible(reward)
            }
            return !completeCatchbasin
        })

        this.collectibles.forEach((collectible: Collectible) => {
            collectible.update(deltaSeconds);
            if (overlaps(this.player.hitbox, collectible.hitbox) && collectible.canBePickedBy(this.player)) {
                const collectibleOverflow: Collectible | undefined = this.player.purse.add(collectible);
                if (collectibleOverflow === undefined) {
                    this.collectibles = this.collectibles.filter((other: Collectible) => other !== collectible)
                }
            }
        })

        this.workers.forEach((worker: Worker) => {
            worker.updateWorldContexte(this.worldContext)
            worker.update(deltaSeconds)
        })

        this.hunters.forEach((hunter: Hunter) => {
            hunter.updateWorldContexte(this.worldContext);
            hunter.update(deltaSeconds)
        })

        this.pyonsCamps.forEach((pyonsCamp: PyonsCamp) => {
            pyonsCamp.updateWorldContext(this.worldContext)
            pyonsCamp.pyonsCreated = this.pyons.filter((pyon: Pyon) => pyon.createdBy === pyonsCamp)
            const pyon: Pyon | undefined = pyonsCamp.update(deltaSeconds);
            if (pyon) this.pyons.push(pyon);
        })

        this.pyons.forEach((pyon: Pyon) => {
            pyon.update(deltaSeconds)
        })

        this.muaddibs.forEach((muaddib) => {
            muaddib.updateWorldContexte(this.worldContext);
            muaddib.update(deltaSeconds)
        });

        this.taskDistributor();
    }

    public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        const gradient: CanvasGradient = ctx.createLinearGradient(0, 0, 0, camera.convert({ x: 0, y: GROUND }).y)
        const gradientColors: string[] = this.clock.timeOfDay === 'day' ? DAY_LIGHT_GRADIENT : NIGHT_GRADIENT;
        gradientColors.forEach((color: string, index: number) => gradient.addColorStop(index / (gradientColors.length - 1), color))

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        // Bouger ca dans une class Sun, qui herite de Celestial,
        // comme ca on peux mettre la lune et pleins d'autres trucs (lune rouge, eclipse ...)
        const sunSize: Pixel = 3 * METER_UNIT;
        ctx.fillStyle = 'yellow';
        const sunAngle: number = (this.clock.timeInDay / DAY_LENGTH) * 2 * Math.PI;
        const sunX: number = (SCREEN_WIDTH / 2) - Math.cos(sunAngle) * SCREEN_HEIGHT / 2;
        const suny: number = (SCREEN_HEIGHT / 2) - Math.sin(sunAngle) * SCREEN_HEIGHT / 2;
        ctx.fillRect(sunX, suny, sunSize, sunSize)

        this.ground.draw(ctx, camera);
        this.purchasables.forEach((purchasable: Purchasable) => targetHighlight(ctx, camera, purchasable, this.player.target === purchasable))
        this.muaddibs.forEach((muaddib: Muaddib) => muaddib.draw(ctx, camera));
        this.workers.forEach((worker: Worker) => worker.draw(ctx, camera))
        this.hunters.forEach((hunter: Hunter) => hunter.draw(ctx, camera));
        this.pyonsCamps.forEach((pyonsCamp: PyonsCamp) => pyonsCamp.draw(ctx, camera));
        this.pyons.forEach((pyon: Pyon) => pyon.draw(ctx, camera));

        this.collectibles.forEach((collectible: Collectible) => collectible.draw(ctx, camera));
        this.player.draw(ctx, camera);
    }
}