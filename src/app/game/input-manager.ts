import { KeyActionInGame, INPUT_MAPPING, ActionTrigger, KeyboardKey } from "./config";

type KeyRecord = {
    isDown: boolean,
    releasedAt: number
}

export class InputManager {

    public readonly keysPressed: Set<KeyboardKey> = new Set<KeyboardKey>();

    private holdDelay: number = 200; // c'est sous ce delay qu'on considère une tap, plus c'est du hold.

    private keyRegistry = new Map<KeyboardKey, KeyRecord>()

    isActive(action: KeyActionInGame): boolean {
        const keysAndTriggerFromActionInGame: { keys: KeyboardKey[], trigger: ActionTrigger } = INPUT_MAPPING[action];
        const keys: KeyboardKey[] = keysAndTriggerFromActionInGame.keys;
        const trigger: ActionTrigger = keysAndTriggerFromActionInGame.trigger;
        if (keys.some((key: KeyboardKey) => this.keysPressed.has(key))) {
            switch (trigger) {
                case "double_tap_hold": return true
                case "hold":
                    return true
                case "long_hold": return true
                default: return true
            }
        }
        return false
    }

    public inputPress(keyPressed: KeyboardEvent): void {
        this.keysPressed.add(keyPressed.code)
        keyPressed.preventDefault();
    }

    public inputRelease(keyPressed: KeyboardEvent): void {
        this.keysPressed.delete(keyPressed.code)
    }

    public onBlur(): void {
        this.keysPressed.clear();
    }

}