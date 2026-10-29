import { KeyActionInGame, INPUT_MAPPING, ActionTrigger, KeyboardKey } from "./config";

type KeyRecord = {
    releasedAt: number | undefined,
    pressedAt: number
}

export class InputManager {
    private doubleTapDelay: number = 250; // le laps de temps entre deux taps pour faire un double tap !
    private tapDelay: number = 200;
    private longHoldDelay: number = 800; // délais a partir du quel on considere un appuis long sur une touche 
    private keyRegistry = new Map<KeyboardKey, KeyRecord>()

    private previousFrameTimestamp: number = 0;
    private currentFrameTimestamp: number = 0;
    /**
     * Verifie en temps réel, (puisque qu'elle est appelé à chaque frame ) si une action est demandé 
     * par le joueur.
     * @param action: KeyActionInGame ('move_left' | 'run_right' | 'secondary_action' | 'pay' ...)
     * @returns             
     */
    isActive(action: KeyActionInGame): boolean {
        const keysAndTriggerFromActionInGame: { keys: KeyboardKey[], trigger: ActionTrigger } = INPUT_MAPPING[action];
        const trigger: ActionTrigger = keysAndTriggerFromActionInGame.trigger;
        const actionsKeys: KeyboardKey[] = keysAndTriggerFromActionInGame.keys; // => ["keyA", "arrow_left"]
        return actionsKeys.some((key: KeyboardKey) => {
            const keyRecord: KeyRecord | undefined = this.keyRegistry.get(key)
            if (keyRecord === undefined) return false
            return this.recordIsValid(trigger, keyRecord);
        })
    }

    public updateClock(timestamp: number) {
        this.previousFrameTimestamp = this.currentFrameTimestamp;
        this.currentFrameTimestamp = timestamp;
    }

    private recordIsValid(trigger: ActionTrigger, keyRecord: KeyRecord): boolean {
        switch (trigger) {
            case "double_tap_hold": return this.isDoubleTap(keyRecord)
            case "tap": return this.isTap(keyRecord)
            case "hold": return this.isDown(keyRecord);
            case "long_hold": return this.isLongHold(keyRecord)
        }
    }

    private isDoubleTap(keyRecord: KeyRecord): boolean {
        if (keyRecord.releasedAt === undefined) return false;
        return (keyRecord.pressedAt - keyRecord.releasedAt) < this.doubleTapDelay && this.isDown(keyRecord);
    }

    private isTap(keyRecord: KeyRecord): boolean {
        if (keyRecord.releasedAt === undefined) return false;
        const delayIsCorrect: boolean = keyRecord.releasedAt - keyRecord.pressedAt < this.tapDelay;
        const inRange: boolean = keyRecord.releasedAt > this.previousFrameTimestamp && keyRecord.releasedAt <= this.currentFrameTimestamp;
        return inRange && delayIsCorrect
    }

    private isDown(keyRecord: KeyRecord): boolean {
        return keyRecord.releasedAt === undefined || keyRecord.pressedAt > keyRecord.releasedAt;
    }

    private isLongHold(keyRecord: KeyRecord): boolean {
        const longHoldAt: number = keyRecord.pressedAt + this.longHoldDelay;
        const inRange: boolean = longHoldAt > this.previousFrameTimestamp && longHoldAt <= this.currentFrameTimestamp;
        return inRange && this.isDown(keyRecord);
    }

    public inputPress(keyPressed: KeyboardEvent): void {
        keyPressed.preventDefault();
        if (keyPressed.repeat) return

        const lastTimePressed: KeyRecord | undefined = this.keyRegistry.get(keyPressed.code);
        if (lastTimePressed) {
            lastTimePressed.pressedAt = performance.now();
            return;
        }
        const input: KeyRecord = {
            releasedAt: undefined,
            pressedAt: performance.now()
        }
        this.keyRegistry.set(keyPressed.code, input)

    }

    public inputRelease(keyPressed: KeyboardEvent): void {
        const lastTimePressed: KeyRecord | undefined = this.keyRegistry.get(keyPressed.code);
        if (lastTimePressed) {
            lastTimePressed.releasedAt = performance.now();
        }
    }

    public onBlur(): void {
        this.keyRegistry.clear();
    }

}