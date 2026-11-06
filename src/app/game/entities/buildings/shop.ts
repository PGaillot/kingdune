import { Hitbox } from "../../../hitbox";
import { Camera } from "../../camera";
import { GameMeter, METER_UNIT, ScreenPoint } from "../../config";
import { Purchasable } from "../../interfaces/purchasable";
import { Building, BuildingOption } from "./building";

const DEFAULT_BUILDING_OPTIONS: Partial<BuildingOption> = {
    color: 'deepskyblue',
}

const DEFAULT_OPTIONS: ShopOption = {
    maxTools: 4,
    toolPrice: 2,
}

export type ToolOption = {
    type: ToolType
    height: GameMeter
    width: GameMeter,
    image: HTMLImageElement,
}

export type ShopOption = {
    maxTools: number,
    toolPrice: number,
}

export type ToolType = 'hammer' | 'maula-pistol';

export class Tool {

    constructor(private x: GameMeter, private y: GameMeter, private options: ToolOption, private createdBy: Shop) { }

    get hitbox(): Hitbox {
        return {
            height: this.options.height,
            width: this.options.width,
            x: this.x - (this.options.width / 2),
            y: this.y
        }
    }

    get type(): ToolType {
        return this.options.type;
    }

    remove(): void {
        this.createdBy.tools = this.createdBy.tools.filter((tool: Tool) => tool !== this)
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        const positionInCamera: ScreenPoint = camera.convert({ x: this.hitbox.x, y: this.hitbox.y })
        ctx.save();
        ctx.drawImage(this.options.image, positionInCamera.x, (positionInCamera.y - this.options.height * METER_UNIT), this.options.width * METER_UNIT, this.options.height * METER_UNIT)
        ctx.restore();
    }
}

export class Shop extends Building implements Purchasable {

    tools: Tool[] = [];

    toolPositionMargin: GameMeter = 0.2;

    get toolsCount(): number {
        return this.tools.length
    };

    readonly shopOption: ShopOption;

    constructor(x: GameMeter, public toolOption: ToolOption, options?: Partial<BuildingOption & ShopOption>) {
        super(x, { ...DEFAULT_BUILDING_OPTIONS, ...DEFAULT_OPTIONS, ...options });
        this.shopOption = { ...DEFAULT_OPTIONS, ...options }
    }

    private get maxToolWidth(): GameMeter {
        return ((this.shopOption.maxTools * this.toolOption.width) + ((this.shopOption.maxTools - 1) * this.toolPositionMargin))
    }
    get initialToolPosition(): { x: GameMeter, y: GameMeter } {
        return { x: this.x - (this.maxToolWidth / 2) + (this.toolOption.width / 2), y: 1 }
    };

    get currentPrice(): number | undefined {
        return this.toolsCount < this.shopOption.maxTools ? this.shopOption.toolPrice : undefined;
    };

    onPaid(): void {
        this.tools.push(new Tool(this.initialToolPosition.x + (this.toolsCount * this.toolOption.width) + (this.toolPositionMargin * this.toolOption.width), this.initialToolPosition.y, this.toolOption, this))
    }

    override draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        super.draw(ctx, camera);
        this.tools.forEach((tool: Tool) => tool.draw(ctx, camera))
    }
}