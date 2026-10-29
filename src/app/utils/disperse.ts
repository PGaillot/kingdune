import { GameMeter } from "../game/config";
import { getRandomBetweenMinMax } from "./random.utils";

/**
 * disperce des Trucs (de préferences des collectibles) sur une zone borné et définit.
 * @param count Nombre d'élements disperser
 * @param begin debut de la zone ou disperser les objets
 * @param end fin de la zone ou disperser les objets
 * @param create la fonction qui creé un objet a l'aide d'une position
 */
export function disperse<T>(
    count: number,
    begin: GameMeter,
    end: GameMeter,
    create: (x: GameMeter) => T
): T[] {
    return Array.from({ length: count }, () => (create(getRandomBetweenMinMax(begin, end))))
}

