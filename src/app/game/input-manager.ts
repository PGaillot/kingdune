import { KeyActionInGame, INPUT_MAPPING } from "./config";

export class InputManager {

    public readonly keysPressed: Set<KeyboardEvent['code']> = new Set<KeyboardEvent['code']>();;


    isActive(action: KeyActionInGame): boolean {
        const keysFromActionInGame: KeyboardEvent['code'][] = this.getKeysFromActionInGame(action);
        return keysFromActionInGame.some((key: KeyboardEvent['code']) => this.keysPressed.has(key))
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

    private getKeysFromActionInGame(actionTriggerInGame: KeyActionInGame): KeyboardEvent['code'][] {
        return INPUT_MAPPING[actionTriggerInGame].keys;
    }
}