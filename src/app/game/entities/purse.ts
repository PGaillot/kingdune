import { Hitbox } from "../../hitbox";
import { Collectible } from "./collectible";

export type PurseCharacter = { purse: Purse, hitbox: Hitbox };

export class Purse {

    constructor(private maxSize?: number) { }

    /** contenu de la bouse */
    public readonly content: Collectible[] = [];

    /** nombre de collectible dans la bourse */
    public get contentCount(): number {
        return this.content.length;
    }

    /** pour retirer le dernier collectible ajouté, et le retourne*/
    public remove(): Collectible | undefined {
        const collectible: Collectible | undefined = this.content.pop();
        return collectible
    }

    /** pour ajouter un collectible a la bourse */
    public add(collectible: Collectible): undefined | Collectible {
        if (this.maxSize === undefined || this.content.length < this.maxSize) {
            collectible.resetSpeed();
            this.content.push(collectible)
            return
        }
        return collectible
    }

}