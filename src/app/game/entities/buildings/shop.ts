import { Camera } from "../../camera";
import { GameMeter } from "../../config";
import { Purchasable } from "../../interfaces/purchasable";
import { Tool, ToolOption } from "../tool";
import { Building, BuildingOption } from "./building";

const DEFAULT_BUILDING_OPTIONS: Partial<BuildingOption> = {
    color: 'deepskyblue',
}

const DEFAULT_OPTIONS: ShopOption = {
    maxTools: 4,
    toolPrice: 2,
}

export type ShopOption = {
    maxTools: number,
    toolPrice: number,
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