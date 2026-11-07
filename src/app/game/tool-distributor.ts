import { centerX } from "../hitbox";
import { Tool } from "./entities/buildings/shop";
import { Fremen } from "./entities/fremen";

/** Distribue les Tools au Fremen */
export function toolsDistributor(availableTools: Tool[], availableFremens: Fremen[]): void {
    // quel frement est le plus proche de chaque Tool ?
    availableTools.forEach((tool: Tool) => {
        if (availableFremens.length >= 1) {
            const fremenReady: Fremen = availableFremens.reduce((a: Fremen, b: Fremen) =>
                Math.abs(centerX(a.hitbox) - centerX(tool.hitbox)) < Math.abs(centerX(b.hitbox) - centerX(tool.hitbox)) ? a : b
            )
            availableFremens = availableFremens.filter((fremen: Fremen) => fremen !== fremenReady)
            fremenReady.toolTargeted = tool; // vise l'outil;
        }
    })
};