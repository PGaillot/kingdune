import { GameMeter, Second } from "../config";
import { CharacterOptions } from "./character";
import { Npc, WorldContext } from "./npc";
import { Purse } from "./purse";

const DEFAULT_OPTIONS: Partial<CharacterOptions> = { color: 'black' }

export class Hunter extends Npc<'hunt' | 'protect_sietch'> {

    purse: Purse = new Purse();

    constructor(x: GameMeter, y: GameMeter, worldContext: WorldContext, options?: Partial<CharacterOptions>) {
        super(x, y, 2, 4, worldContext, { ...DEFAULT_OPTIONS, ...options });
    }

    override update(deltaSeconds: Second): void {
        switch (this.state) {
            case "idle":
                super.update(deltaSeconds);
                if (this.worldContext.clock.timeOfDay === 'night') this.state = 'protect_sietch';
                break
            case 'protect_sietch':
                if (this.worldContext.clock.timeOfDay === 'day') this.state = 'idle';
                this.goToHitbox(this.worldContext.sietchZone, deltaSeconds, 'run')
                break;
        }
    }
}