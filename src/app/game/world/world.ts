import { Camera } from "../camera";
import { CENTER, DAY_LIGHT_GRADIENT, Direction, GROUND, NIGHT_GRADIENT, SCREEN_HEIGHT, SCREEN_WIDTH, Second, Side, type GameMeter } from "../config";
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
import { Celestial } from "../entities/celestial";
import { Fremen } from "../entities/fremen";
import type { PurseHolder } from "../entities/purse";
import { Shop } from "../entities/buildings/shop";
import { taskDistributor } from "../task-distributor";
import { toolsDistributor } from "../tool-distributor";
import { getRandomBetweenMinMax } from "../../utils/random.utils";
import { Bush } from "../entities/bush";
import { Tool } from "../entities/tool";
import { AudioEvent, AudioManager } from "../audio-manager";
import { CollectibleThrower } from "../interfaces/collectible-thrower";

const MOON_IMAGE: HTMLImageElement = new Image();
const SUN_IMAGE: HTMLImageElement = new Image();
MOON_IMAGE.src = 'ressources/celestial/moon.png';
SUN_IMAGE.src = 'ressources/celestial/sun.png';

const HAMMER_IMAGE: HTMLImageElement = new Image();
HAMMER_IMAGE.src = 'ressources/tools/hammer.png';
const MAULA_PISTOL_IMAGE: HTMLImageElement = new Image();
MAULA_PISTOL_IMAGE.src = 'ressources/tools/maula-pistol.png';

/**
 * La classe pour contruire le Monde,
 * donc le terrain et tout ce que le monde contient,
 * elle prend une Largeur, et retourne la fin
 * de gauche de droite et le centre de celui ci.
 * @param radius 
 */
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
    fremens: Fremen[] = [];
    moon: Celestial;
    sun: Celestial;
    workersShop: Shop;
    pistolShop: Shop;
    initialSietchPyons: number = 4;

    bushes: Bush[] = [];

    constructor(public readonly radius: GameMeter, public audioManager: AudioManager, catchbasinCount: number = 20) {
        this.clock = new Clock(0)
        this.sun = new Celestial(3, SUN_IMAGE, this.clock, 0)
        this.moon = new Celestial(3, MOON_IMAGE, this.clock, 180)
        this.ground = new Ground(this.leftEnd, this.width);
        this.catchbasins = this.getRandomCatchbasinPositions(catchbasinCount).map((x) => new Catchbasin(x));
        this.sietch = new Sietch();
        this.buildSietchZone();
        this.collectibles.push(...disperse<WaterRing>(15, -15, 15, (x: GameMeter) => new WaterRing(x, GROUND)));
        this.player = new PlayerCharacter(this.center, GROUND, this.leftEnd, this.rightEnd);
        this.pyonsCamps.push(new PyonsCamp(-32, this.worldContext, 2));
        this.pyonsCamps.push(new PyonsCamp(34, this.worldContext, 2));
        this.bushes.push(new Bush(-18, this.worldContext))

        this.workersShop = new Shop(-6, { type: 'hammer', height: 1, width: 1, image: HAMMER_IMAGE }, { color: 'darkgreen', toolPrice: 3 })
        this.pistolShop = new Shop(6, { type: 'maula-pistol', height: 1, width: 1, image: MAULA_PISTOL_IMAGE }, { color: 'indianred', toolPrice: 2 })

        this.pyonsCamps.forEach((pyonsCamp: PyonsCamp) => {
            for (let i = 0; i < pyonsCamp.initialPyonsNumber; i++) {
                this.pyons.push(pyonsCamp.createPyon())
            }
        })

        this.bushes.forEach((bush: Bush) => {
            for (let i = 0; i < bush.initialMuaddids; i++) {
                this.muaddibs.push(bush.createMuaddib())
            }
        })

    }

    get worldContext(): WorldContext {
        return {
            sietchZone: this.sietchZone,
            clock: this.clock,
            sideWalls: {
                [-1]: this.getLastSietchWall(-1),
                [1]: this.getLastSietchWall(1),
            },
            world: {
                start: this.leftEnd,
                center: this.center,
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
        };
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

    get purseHolders(): PurseHolder[] {
        return [this.player, ...this.pyons, ...this.workers, ...this.hunters, ...this.fremens]
    }


    get collectibleThrowers(): CollectibleThrower[] {
        return [
            ...this.workers,
            //  ...this.hunters,
            ...this.fremens
        ]
    }

    get purchasables(): Purchasable[] {
        return [...this.catchbasins, this.sietch, ...this.walls, this.workersShop, this.pistolShop]
    }


    get shops(): Shop[] {
        return [this.workersShop, this.pistolShop]
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
        return [...this.catchbasins, ...this.walls]
    }

    get availableTools(): Tool[] {
        const allTools: Tool[] = this.shops.flatMap((shop: Shop) => shop.tools);
        const toolsTargeted: Tool[] = this.fremens.flatMap((fremen: Fremen) => fremen.toolTargeted ?? [])
        return allTools.filter((tool: Tool) => !toolsTargeted.includes(tool))
    }

    get availableFremens(): Fremen[] {
        return this.fremens.filter((fremen: Fremen) => fremen.toolTargeted === undefined)
    }

    getHuntersBySides(side: Side): Hunter[] {
        return this.hunters.filter((hunter: Hunter) => hunter.assignedSide === side)
    }

    get sideWithLessHunter(): Side {
        return this.getHuntersBySides(-1).length < this.getHuntersBySides(1).length ? -1 : 1;
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


    private buildSietchZone(): void {
        const sietchIndex: number = this.ground.toIndex(this.sietch.position - this.sietch.width / 2);
        this.ground.setZone(sietchIndex, this.sietch.width, new RockBiome());
        this.walls = [...mirrored(14, (x: GameMeter) => new Wall(x)), ...mirrored(26, (x: GameMeter) => new Wall(x))];
        for (let i = 0; i < this.initialSietchPyons; i++) {
            const randomX: GameMeter = getRandomBetweenMinMax(this.sietchZone.x, this.sietchZone.x + this.sietchZone.width);
            this.pyons.push(new Pyon(randomX, GROUND, this.worldContext))
        }
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

    public update(deltaSeconds: Second) {
        this.clock.updateClock(deltaSeconds);
        this.catchbasins = this.catchbasins.filter((catchbasin: Catchbasin) => {
            const completeCatchbasin: boolean = catchbasin.workChargeLeft <= 0;
            if (completeCatchbasin) {
                const reward: WaterRing[] = catchbasin.complete();
                this.createCollectible(reward)
            }
            return !completeCatchbasin
        })

        this.walls.forEach((wall: Wall) => {
            const completeWall: boolean = wall.workChargeLeft <= 0 && wall.workInProgress;
            if (completeWall) wall.complete();
        })

        this.collectibles.forEach((collectible: Collectible) => {
            const audioEvent: AudioEvent | undefined = collectible.update(deltaSeconds);
            if (audioEvent) this.audioManager.playSoundEvent(audioEvent);
            const receiver: PurseHolder | undefined = this.purseHolders.find((character: PurseHolder) => {
                const receiverIsPyon: boolean = character instanceof Pyon;
                return overlaps(character.hitbox, collectible.hitbox) && collectible.canBePickedBy(character) && (!receiverIsPyon || collectible.from === this.player)
            })
            if (receiver !== undefined) {
                const collectibleOverflow: Collectible | undefined = receiver.purse.add(collectible);
                if (collectibleOverflow === undefined) {
                    this.collectibles = this.collectibles.filter((other: Collectible) => other !== collectible);
                }
            }
        })

        this.player.update(deltaSeconds)

        this.bushes.forEach((bush: Bush) => {
            bush.updateWorldContext(this.worldContext)
            const muaddibsCreatedCount: number = this.muaddibs.filter((muaddib: Muaddib) => muaddib.attachAt === bush).length
            const muaddib: Muaddib | undefined = bush.update(deltaSeconds, muaddibsCreatedCount);
            if (muaddib) this.muaddibs.push(muaddib);
        })

        this.collectibleThrowers.forEach((collectibleThrower: CollectibleThrower) => {
            if (collectibleThrower.purse.contentCount > 0 && overlaps(this.player.hitbox, collectibleThrower.view)) {
                const distanceBetweenPlayerAndCharacter: GameMeter = centerX(this.player.hitbox) - centerX(collectibleThrower.hitbox);
                const collectibleDropped: Collectible | undefined = collectibleThrower.throwCollectible(distanceBetweenPlayerAndCharacter);
                if (collectibleDropped !== undefined) {
                    this.collectibles.push(collectibleDropped);
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

        this.fremens.forEach((fremen: Fremen) => {
            fremen.updateWorldContexte(this.worldContext);
            // Chercher tout les outils disponible et repatir les outils au fremen les plus proche.
            // ils viennent eu centreX du batiment, font dispaitre un tool, supprime le fremen et tranforme dans le type recherché.
            if (fremen.toolTargeted && overlaps(fremen.hitbox, fremen.toolTargeted.hitbox)) {
                this.fremens = this.fremens.filter((f: Fremen) => f !== fremen);
                switch (fremen.toolTargeted.type) {
                    case "maula-pistol":
                        this.hunters.push(new Hunter(fremen.hitbox.x + (fremen.hitbox.width / 2), fremen.hitbox.y, this.sideWithLessHunter, fremen.worldContext))
                        break
                    default:
                        this.workers.push(new Worker(fremen.hitbox.x + (fremen.hitbox.width / 2), fremen.hitbox.y, fremen.worldContext))
                }
                fremen.toolTargeted.remove()
            }

            fremen.update(deltaSeconds)
        });

        this.pyons.forEach((pyon: Pyon) => {
            pyon.updateWorldContexte(this.worldContext);
            pyon.update(deltaSeconds);
            if (pyon.purse.contentCount >= 1) { // si le pyon recupere une piece (du naïb uniquement ?) il devient un Fremen !  
                this.pyons = this.pyons.filter((p: Pyon) => p !== pyon);
                this.fremens.push(new Fremen(pyon.x, pyon.y, pyon.worldContext));
            }
        })

        this.muaddibs.forEach((muaddib: Muaddib) => {
            muaddib.updateWorldContexte(this.worldContext);
            muaddib.update(deltaSeconds)
        });

        taskDistributor(this.workersTasks, this.availableWorkers);
        toolsDistributor(this.availableTools, this.availableFremens);
    }

    public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        const gradient: CanvasGradient = ctx.createLinearGradient(0, 0, 0, camera.convert({ x: 0, y: GROUND }).y)
        const gradientColors: string[] = this.clock.timeOfDay === 'day' ? DAY_LIGHT_GRADIENT : NIGHT_GRADIENT;
        gradientColors.forEach((color: string, index: number) => gradient.addColorStop(index / (gradientColors.length - 1), color))

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        this.moon.draw(ctx, camera);
        this.sun.draw(ctx, camera);

        this.ground.draw(ctx, camera);
        this.purchasables.forEach((purchasable: Purchasable) => targetHighlight(ctx, camera, purchasable, this.player.target === purchasable))
        this.pyonsCamps.forEach((pyonsCamp: PyonsCamp) => pyonsCamp.draw(ctx, camera));
        this.muaddibs.forEach((muaddib: Muaddib) => muaddib.draw(ctx, camera));
        this.workers.forEach((worker: Worker) => worker.draw(ctx, camera))
        this.hunters.forEach((hunter: Hunter) => hunter.draw(ctx, camera));
        this.fremens.forEach((fremen: Fremen) => fremen.draw(ctx, camera));
        this.pyons.forEach((pyon: Pyon) => pyon.draw(ctx, camera));

        this.bushes.forEach((bush: Bush) => bush.draw(ctx, camera));

        this.collectibles.forEach((collectible: Collectible) => collectible.draw(ctx, camera));
        this.player.draw(ctx, camera);
    }
}