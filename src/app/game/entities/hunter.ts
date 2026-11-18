import { Hitbox } from "../../hitbox";
import { GameMeter, Second, Side } from "../config";
import { CharacterOptions } from "./character";
import { Npc, WorldContext } from "./npc";
import { Purse } from "./purse";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = { color: 'black' }

export class Hunter extends Npc<'hunt' | 'protect_sietch'> {

    purse: Purse = new Purse();

    constructor(x: GameMeter, y: GameMeter,public assignedSide:Side, worldContext: WorldContext, options?: Partial<CharacterOptions>) {
        super(x, y, 2, 4, worldContext, { ...DEFAULT_OPTIONS, ...options });
    }

    private positionXHuntZone(side:Side):GameMeter {
      return  side === -1 ? this.worldContext.world.start : this.worldContext.sietchZone.x + this.worldContext.sietchZone.width; 
    }

    private widthHuntZone(side:Side):GameMeter {
      return  side === -1 ? this.worldContext.sietchZone.x - this.worldContext.world.start  : this.worldContext.world.end - (this.worldContext.sietchZone.x + this.worldContext.sietchZone.width) 
    }

    get huntZone():Hitbox{
        return {
            height: 0.5, 
            width: this.widthHuntZone(this.assignedSide),
            x: this.positionXHuntZone(this.assignedSide),
            y:0,
            strokeDebugColor:'hotpink'
        }
    }

    override update(deltaSeconds: Second): void {
        switch (this.state) {
            case "idle":
                this.idleInArea(deltaSeconds,  this.huntZone, 'walk')
                if (this.worldContext.clock.timeOfDay === 'night') this.state = 'protect_sietch';
                break
            case 'protect_sietch':
                if (this.worldContext.clock.timeOfDay === 'day') this.state = 'idle';
                this.goToHitbox(this.worldContext.sideWalls[this.assignedSide].hitbox, deltaSeconds, 'run')
                break;
        }
    }
}