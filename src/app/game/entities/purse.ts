import { Hitbox } from "../../hitbox";
import { Collectible } from "./collectible";

export type PurseCharacter = { purse: Purse, hitbox: Hitbox };


/**
 * La purse est une classe qui doit etre ajouté à tout les 
 * Character qui on besoin de recuperer des Collectible, 
 * c'est leurs poches en quelque sorte.
 * 
 * il y a une fonction pour ajouter, une pour supprimer des collectible.
 * Et un getter pour avoir le nombre d'éléments qu'elle contient.
 */
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
            collectible.from = undefined;
            collectible.droppedBy = undefined;
            this.content.push(collectible)
            return
        }
        return collectible
    }

}